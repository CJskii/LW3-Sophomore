const { ethers } = require("hardhat");

async function main() {
  /*
  A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  so whitelistContract here is a factory for instances of our Whitelist contract.
  */
  const whitelistContract = await ethers.getContractFactory("Whitelist");

  console.log(
    "---------------------------------------------------------------"
  );

  // here we deploy the contract
  const deployedWhitelistContract = await whitelistContract.deploy(10);
  console.log("Deploying Whitelist Contract...");
  // 10 is the Maximum number of whitelisted addresses allowed

  // Wait for it to finish deploying
  await deployedWhitelistContract.deployed();
  console.log("Whitelist contract deployed!");
  // print the address of the deployed contract
  console.log("Contract Address:", deployedWhitelistContract.address);
  console.log(
    "---------------------------------------------------------------"
  );
  return deployedWhitelistContract.address;
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
