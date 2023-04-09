const { exec } = require("child_process");
const fs = require("fs");

const commands = [
  { command: "npx hardhat compile", name: null },
  {
    command:
      "npx hardhat run scripts/deployWhitelistContract.js --network sepolia",
    name: "CD_WHITELIST_CONTRACT_ADDRESS",
  },
  {
    command: "npx hardhat run scripts/deployNFTCollection.js --network sepolia",
    name: "CD_NFT_CONTRACT_ADDRESS",
  },
  {
    command: "npx hardhat run scripts/deployToken.js --network sepolia",
    name: "CD_TOKEN_CONTRACT_ADDRESS",
  },
  {
    command:
      "npx hardhat run scripts/deployFakeMarketplace.js --network sepolia",
    name: "CD_MARKETPLACE_CONTRACT_ADDRESS",
  },
  {
    command: "npx hardhat run scripts/deployDAO.js --network sepolia",
    name: "CD_DAO_CONTRACT_ADDRESS",
  },
  {
    command: "npx hardhat run scripts/deployExchange.js --network sepolia",
    name: "CD_EXCHANGE_CONTRACT_ADDRESS",
  },
];

let configData = {};

function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(error);
      } else {
        console.log(stdout);
        resolve(stdout);
      }
    });
  });
}

async function executeCommands(commands) {
  for (const { command, name } of commands) {
    try {
      const output = await executeCommand(command);
      if (name) {
        const addressMatch = output.match(/(0x[a-fA-F0-9]{40})/);

        if (addressMatch) {
          configData[name] = addressMatch[1];
          writeConfigFile(configData); // Write the config file after each iteration
        }
      }
    } catch (error) {
      console.error("Error executing command:", error);
    }
  }
}

function writeConfigFile(configData) {
  const configContent = formatConfigData(configData);
  fs.writeFileSync("yourContracts.js", configContent);
}

function formatConfigData(data) {
  let content = "";
  for (const [name, address] of Object.entries(data)) {
    content += `// ETHERSCAN: https://sepolia.etherscan.io/address/${address}\n`;
    content += `const ${name} = "${address}";\n\n\n`;
  }
  content += "module.exports = {";
  content += Object.keys(data).join(", ");
  content += "};\n";
  return content;
}

executeCommands(commands);
