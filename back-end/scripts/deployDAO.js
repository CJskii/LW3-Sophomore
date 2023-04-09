const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });
const {
  FAKE_NFT_MARKETPLACE_CONTRACT_ADDRESS,
  CRYPTO_DEVS_NFT_CONTRACT_ADDRESS,
} = require("../constants/index");

async function main() {
  // Deploy the CryptoDevsDAO contract
  const CryptoDevsDAO = await ethers.getContractFactory("CryptoDevsDAO");
  const cryptoDevsDAO = await CryptoDevsDAO.deploy(
    FAKE_NFT_MARKETPLACE_CONTRACT_ADDRESS,
    CRYPTO_DEVS_NFT_CONTRACT_ADDRESS,
    {
      // This assumes your metamask account has at least 1 ETH in its account
      // Change this value as you want
      value: ethers.utils.parseEther("1"),
    }
  );
  console.log(
    "---------------------------------------------------------------"
  );
  console.log("Deploying CryptoDevsDAO contract...");
  await cryptoDevsDAO.deployed();
  console.log("CryptoDevsDAO contract deployed!");

  console.log("Contract Address:", cryptoDevsDAO.address);
  console.log(
    "---------------------------------------------------------------"
  );
  return cryptoDevsDAO.address;
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
