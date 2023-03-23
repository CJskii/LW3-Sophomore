// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4 ;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IWhitelist.sol";

contract CryptoDevs is ERC721Enumerable, Ownable {
    
    string _baseTokenURI;

    uint256 public _price = 0.01 ether;

    bool public _paused;

    uint256 public maxTokenIds = 20;

    uint256 public maxTokens;

    uint256 public tokenIds;

    IWhitelist whitelist;

    bool public presaleStarted; 

    uint256 public presaleEnded;

    modifier onlyWhenNotPaused {
        require(!_paused, "Contract currenty paused");
        _;
    }

    constructor (string memory baseURI, address whitelistContract) ERC721("Crypto Devs", "CD"){
        _baseTokenURI = baseURI;
        whitelist = IWhitelist(whitelistContract);
    }

    // function to start presale

    function startPresale() public onlyOwner {
        presaleStarted = true;

        presaleEnded = block.timestamp + 5 minutes;
    }

    // function to mint NFT during the presale
    // check if presale has started and current time is before time of presale ending
    // check if total number of tokens minted doesn't exceed max tokenIds in the contract
    // check if value of ethers sent to the contract are more or equal than current price in the contract

    // if all conditions are met 
    // increment totalIds variable in the contract
    // call safemint function

    function presaleMint() public payable onlyWhenNotPaused {
        require(presaleStarted && block.timestamp < presaleEnded, "Presale not started");
        require(tokenIds < maxTokenIds, "Exceeded maximum supply");
        require(msg.value >= _price, "Incorrect ether value");
        tokenIds += 1;
        _safeMint(msg.sender, tokenIds);
    }

    // function to mint NFT after the presale has ended
    // check if presale is over
    // check if total number of tokens minted doesn't exceed max tokenIds in the contract
    // check if value of ethers sent to the contract are more or equal than current price in the contract

    // if all conditions are met 
    // increment totalIds variable in the contract
    // call safemint function

    function mint() public payable onlyWhenNotPaused {
        require(presaleStarted && block.timestamp >= presaleEnded, "Presale not started yet");
        require(tokenIds < maxTokenIds, "Exceeded maximum supply");
        require(msg.value >= _price, "Incorrect ehter value");
        tokenIds += 1;
        _safeMint(msg.sender, tokenIds);
    }

    // override default ERC721 standard function with our metadata
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    // pause contract
    function setPaused(bool val) public onlyOwner {
        _paused = val;
    }

    // withraw all funds from the contract - only owner of the contract can call it
    function withdraw() public onlyOwner {
        address _owner = owner();
        uint256 amount = address(this).balance;

        (bool sent, ) = _owner.call{value:amount}("");
        require(sent, "Failed to sent ether");
    }

    // function to receive ether. msg.data must be empty
    receive() external payable {}

    // fallback function to receive ether. msg.data must be empty
    fallback() external payable {}
}