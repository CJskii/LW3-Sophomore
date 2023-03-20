//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Whitelist {


// Maximum number of addresses allowed
uint8 public maxWhitelistedAddresses;

// Mapping of the WhitelistedAddresses 
// by default all adresses are set to false
// if and address is whitelisted, our contract will set it to true

mapping(address => bool) public whitelistedAddresses;

// uint to keep track of how many addresses was whitelisted
uint8 public numAddressesWhitelisted;


// When we deploy this contract we will set maximum number of whitelisted addresses
// We will put this value in deploy script
constructor (uint8 _maxWhitelistedAddresses) {
    maxWhitelistedAddresses = _maxWhitelistedAddresses;
}

// This function will add address to whitelist
function addAddressToWhitelist() public {
    // check if user is already whitelisted
    require(!whitelistedAddresses[msg.sender], "Sender has been whitelisted already");
    // check if whitelisted addresses are less than max addresses allowed in the contract
    require(numAddressesWhitelisted < maxWhitelistedAddresses, "Limit of whitelisted addresses reached");

    // add address that called function to whitelistedAddress array
    whitelistedAddresses[msg.sender] = true;
    
    // increase the number of addresses in the contract
    numAddressesWhitelisted += 1;
}




}