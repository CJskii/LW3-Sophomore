const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });

async function main() {
  // Deploy the FakeNFTMarketplace contract first
  const FakeNFTMarketplace = await ethers.getContractFactory(
    "FakeNFTMarketplace"
  );
  console.log(
    "---------------------------------------------------------------"
  );
  const fakeNftMarketplace = await FakeNFTMarketplace.deploy();
  console.log("Deploying FakeNFTMarketplace contract...");
  await fakeNftMarketplace.deployed();
  console.log("FakeNFTMarketplace contract deployed!");

  console.log("Contract Address:", fakeNftMarketplace.address);
  console.log(
    "---------------------------------------------------------------"
  );
  return fakeNftMarketplace.address;
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
