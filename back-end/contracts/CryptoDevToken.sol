// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ICryptoDevsToken.sol";

contract CryptoDevToken is ERC20, Ownable {
    // Price of one token
    uint256 public constant tokenPrice = 0.001 ether;

    // Each NFT will give user 10 tokens
    // It needs to be represented as 10 * (10 ** 18) as ERC20 tokens are represented by the smallest denomination possible for the token
    // 1 full token === (10 ^ -18) 
    uint256 public constant tokensPerNFT = 10 * 10**18;

    // Max total supply set to 10000 tokens
    uint256 public constant maxTotalSupply = 10000 * 10**18;

    // NFT contract instance
    ICryptoDevs CryptoDevsNFT;

    // Mapping to keep track of which tokenIds have been claimed
    mapping(uint256 => bool) public tokenIdsClaimed;

    // on deployment - set interface for our NFT contract
    constructor(address _cryptoDevsNFT) ERC20("Crypto Dev Token", "CD"){
        CryptoDevsNFT = (ICryptoDevs(_cryptoDevsNFT));
    }

    // Mints 'amount' of tokens
    // Req - 'msg.value' should be equal or greater than the tokenPrice * amount
    function mint(uint256 amount) public payable {
        // calculate required ether for the mint and check input
        uint256 _requiredEther = tokenPrice * amount;
        require(msg.value >= _requiredEther, "Ether is incorrect");
        // total of minted tokens + amount <= 10000, otherwise revert transaction
        uint256 amountWithDecimals = amount * 10**18;
        require((totalSupply() + amountWithDecimals) <= maxTotalSupply, "Exceeds the max total supply available");
        // call mint function from ERC20 standart
        _mint(msg.sender, amountWithDecimals);
    }

    function claim() public {
        address sender = msg.sender;
        // get number of NFTs held by sender
        uint256 balance = CryptoDevsNFT.balanceOf(sender);
        // if balance is 0 revert transaction
        require(balance > 0, "You don't own any Crypto Dev NFT");
        // amount keeps track of unclaimed token number
        uint256 amount = 0;
        for (uint256 i = 0; i < balance; i++) {
            uint256 tokenId = CryptoDevsNFT.tokenOfOwnerByIndex(sender, i);
            // if the tokenId has not been claimed, increase the amount
            if (!tokenIdsClaimed[tokenId]) {
                amount += 1;
                tokenIdsClaimed[tokenId] = true;
            }
        }
        // if all the token Ids have been claimed, revert the transaction;
        require(amount > 0, "You have already claimed all the tokens");
        // if all conditions are met - call mint function
        _mint(msg.sender, amount * tokensPerNFT);
    }

    // Withdraws all ether from this contract - only owner
    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance;
        require(amount > 0, "Nothing to withdraw, contract balance empty");
        address _owner = owner();
        
        (bool sent, ) = _owner.call{value: amount}("");
        require(sent, "Failed to send ether");
    }

    // function to receive ether. msg.data must be empty
    receive() external payable {}

    // falback function is called when msg.data is not empty
    fallback() external payable {}
}