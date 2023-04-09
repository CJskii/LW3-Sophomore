const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });
const { CRYPTO_DEV_TOKEN_CONTRACT_ADDRESS } = require("../constants/index");

async function main() {
  const cryptoDevTokenAddress = CRYPTO_DEV_TOKEN_CONTRACT_ADDRESS;
  /*
  A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  so exchangeContract here is a factory for instances of our Exchange contract.
  */
  const exchangeContract = await ethers.getContractFactory("Exchange");

  // here we deploy the contract
  const deployedExchangeContract = await exchangeContract.deploy(
    cryptoDevTokenAddress
  );
  console.log(
    "---------------------------------------------------------------"
  );
  console.log("Deploying Exchange Contract...");
  await deployedExchangeContract.deployed();
  console.log("Exchange contract deployed!");

  // print the address of the deployed contract
  console.log("Contract Address:", deployedExchangeContract.address);
  console.log(
    "---------------------------------------------------------------"
  );
  return deployedExchangeContract.address;
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
