// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IFakeNFTMarketplace {
    /// dev purchase() purchases an NFT from the FakeNFTMarketplace
    /// param _tokenId - the fake NFT tokenID to purchase
    function buy(uint256 _tokenId) external payable;
    /// dev - getPrice() returns the price of an NFT from the FakeNFTMarketplace
    /// return - Returns the price in Wei for an NFT
    function getPrice() external view returns (uint256);
    /// dev available() returns whether or not the given _tokenId has already been purchased
    /// return Returns a boolean value - true if available, false if not
    function available(uint256 _tokenId) external view returns (bool);
}

interface CryptoDevsNFT {
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

struct Proposal {
    uint256 nfTokenID;
    uint256 deadline;
    uint256 yayVotes;
    uint256 nayVotes;
    bool executed;
    mapping(address => bool) voters;
}

contract CryptoDevsDAO is Ownable {

}