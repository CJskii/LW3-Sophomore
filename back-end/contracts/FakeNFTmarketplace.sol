// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;

contract FakeNFTMarketplace {
    mapping(uint256 => address) public tokens;

    uint256 nftPrice = 0.1 ether;

    function buy(uint256 _tokenId) public payable {
        require(msg.value == nftPrice, "Not enough ETH");
        tokens[_tokenId] = msg.sender;
    }

    function getPrice() external view returns (uint256) {
        return nftPrice;
    }

    function available(uint256 _tokenId) external view returns (bool) {
        if(tokens[_tokenId] == address(0))
            return true;
        else
            return false;
    }

}


