const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });
const { WHITELIST_CONTRACT_ADDRESS, METADATA_URL } = require("../constants");

async function main() {
  // Address of the whitelist contract that you deployed in the previous module
  const whitelistContract = WHITELIST_CONTRACT_ADDRESS;
  // URL from where we can extract the metadata for a Crypto Dev NFT
  const metadataURL = METADATA_URL;
  /*
  A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  so cryptoDevsContract here is a factory for instances of our CryptoDevs contract.
  */
  const cryptoDevsContract = await ethers.getContractFactory("CryptoDevs");
  console.log(
    "---------------------------------------------------------------"
  );
  // deploy the contract
  const deployedCryptoDevsContract = await cryptoDevsContract.deploy(
    metadataURL,
    whitelistContract
  );
  console.log("Deploying Crypto Devs NFT Contract...");

  // Wait for it to finish deploying
  await deployedCryptoDevsContract.deployed();
  console.log("Crypto Devs NFT contract ceployed!");
  // print the address of the deployed contract
  console.log("Contract Address:", deployedCryptoDevsContract.address);
  console.log(
    "---------------------------------------------------------------"
  );
  return deployedCryptoDevsContract.address;
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
