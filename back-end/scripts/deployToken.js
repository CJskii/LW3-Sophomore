const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });
const { CRYPTO_DEVS_NFT_CONTRACT_ADDRESS } = require("../constants");

async function main() {
  // Address of the Crypto Devs NFT contract that you deployed in the previous module
  const cryptoDevsNFTContract = CRYPTO_DEVS_NFT_CONTRACT_ADDRESS;

  /*
    A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
    so cryptoDevsTokenContract here is a factory for instances of our CryptoDevToken contract.
    */
  const cryptoDevsTokenContract = await ethers.getContractFactory(
    "CryptoDevToken"
  );
  console.log(
    "---------------------------------------------------------------"
  );
  // deploy the contract
  const deployedCryptoDevsTokenContract = await cryptoDevsTokenContract.deploy(
    cryptoDevsNFTContract
  );
  console.log("Deploying Crypto Devs Token Contract...");

  await deployedCryptoDevsTokenContract.deployed();
  console.log("Crypto Devs Token contract deployed!");
  // print the address of the deployed contract
  console.log("Contract Address:", deployedCryptoDevsTokenContract.address);
  console.log(
    "---------------------------------------------------------------"
  );
  return deployedCryptoDevsTokenContract.address;
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
