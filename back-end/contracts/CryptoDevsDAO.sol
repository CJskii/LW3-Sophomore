// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IFakeNFTMarketplace {
    /// dev purchase() purchases an NFT from the FakeNFTMarketplace
    /// param _tokenId - the fake NFT tokenID to purchase
    function purchase(uint256 _tokenId) external payable;
    /// dev - getPrice() returns the price of an NFT from the FakeNFTMarketplace
    /// return - Returns the price in Wei for an NFT
    function getPrice() external view returns (uint256);
    /// dev available() returns whether or not the given _tokenId has already been purchased
    /// return Returns a boolean value - true if available, false if not
    function available(uint256 _tokenId) external view returns (bool);
}

interface ICryptoDevsNFT {
    /// dev balanceOf returns the number of NFTs owned by the given address
    /// param owner - address to fetch number of NFTs for
    /// return Returns the number of NFTs owned
    function balanceOf(address _owner) external view returns (uint256);

    /// dev tokenOfOwnerByIndex returns a tokenID at given index for owner
    /// param owner - address to fetch the NFT TokenID for
    /// param index - index of NFT in owned tokens array to fetch
    /// return Returns the TokenID of the NFT
    function tokenOwnerByIndex(address owner, uint256 index) external view returns (uint256);
}

// Create a struct named Proposal containing all relevant information
struct Proposal {
    uint256 nftTokenId;
    uint256 deadline;
    uint256 yayVotes;
    uint256 nayVotes;
    bool executed;
    mapping(uint256 => bool) voters;
}

contract CryptoDevsDAO is Ownable {
    // mapping of id to proposal
    mapping(uint256 => Proposal) public proposals;
    uint256 public numProposals;

    IFakeNFTMarketplace nftMarketplace;
    ICryptoDevsNFT cryptoDevsNFT;

    constructor (address _nftMarketplace, address _cryptoDevsNFT) payable {
        nftMarketplace = IFakeNFTMarketplace(_nftMarketplace);
        cryptoDevsNFT = ICryptoDevsNFT(_cryptoDevsNFT);
    }

    modifier nftHolderOnly {
        require(cryptoDevsNFT.balanceOf(msg.sender) > 0, "Not a DAO member");
        _;
    }

    function createProposal(uint256 _nftTokenId)
        external
        nftHolderOnly
        returns (uint256)
    {
        require(nftMarketplace.available(_nftTokenId), "NFT_NOT_FOR_SALE");
        Proposal storage proposal = proposals[numProposals];
        proposal.nftTokenId = _nftTokenId;
        // Set the proposal's voting deadline to be (current time + 5 minutes)
        proposal.deadline = block.timestamp + 5 minutes;

        numProposals++;

        return numProposals - 1;
    }

    // Create a modifier which only allows a function to be
    // called if the given proposal's deadline has not been exceeded yet
    modifier activeProposalOnly(uint256 proposalIndex) {
        require(
            proposals[proposalIndex].deadline > block.timestamp,
            "DEADLINE_EXCEEDED"
        );
        _;
    }

    enum Vote {Yay, Nay}

    function voteOnProposal(uint256 proposalIndex, Vote vote) external nftHolderOnly activeProposalOnly(proposalIndex) {
        Proposal storage proposal = proposals[proposalIndex];
        
        uint256 voterNFTbalance = cryptoDevsNFT.balanceOf(msg.sender);
        uint numVotes = 0;

        for (uint i = 0; i < voterNFTbalance; i++) {
            uint256 tokenId = cryptoDevsNFT.tokenOwnerByIndex(msg.sender, i);
            if(proposal.voters[tokenId] == false) {
                numVotes++;
                proposal.voters[tokenId] = true;
            }
        }
        require(numVotes > 0, "ALREADY_VOTED");

        if(vote == Vote.Yay) {
            proposal.yayVotes += numVotes;
        } else {
            proposal.nayVotes += numVotes;
        }
    }

    modifier inactiveProposalOnly(uint256 proposalIndex) {
        require(
            proposals[proposalIndex].deadline <= block.timestamp,
            "DEADLINE_NOT_EXCEEDED"
        );
        require(
            proposals[proposalIndex].executed == false,
            "PROPOSAL_ALREADY_EXECUTED"
        );
        _;
    }

    // allow crypto devs to execute a proposal after deadline exceeded
    function executeProposal(uint256 proposalIndex) external nftHolderOnly inactiveProposalOnly(proposalIndex) {
        Proposal storage proposal = proposals[proposalIndex];
        if(proposal.yayVotes > proposal.nayVotes) {
            uint256 nftPrice = nftMarketplace.getPrice();
            require(address(this).balance >= nftPrice, "DAO does not have enough funds to purchase NFT");
            nftMarketplace.purchase{value: nftPrice}(proposal.nftTokenId);
        }
        proposal.executed = true;
    }
    
    // withdraw ether from the DAO contract
    function withdraw() external onlyOwner {
        uint256 amount = address(this).balance;
        require(amount > 0, "DAO has no funds to withdraw");
        (bool sent, ) = payable(owner()).call{value: amount}("");
        require(sent, "Failed to send Ether");
    }

    // allow the contract to accept ETH deposits directly from a wallet without calling a function
    receive() external payable {}

    fallback() external payable {}
    
}