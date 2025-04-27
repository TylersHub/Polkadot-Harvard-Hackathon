require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

const { PRIVATE_KEY } = process.env;
if (!PRIVATE_KEY) throw new Error("Set PRIVATE_KEY in .env");

module.exports = {
  solidity: "0.8.28",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    moonbase: {
      url: "https://rpc.api.moonbase.moonbeam.network",
      accounts: [PRIVATE_KEY],
      chainId: 1287,
      gasPrice: 1000000000,
      timeout: 100000,      
      verify: {
        etherscan: {
          apiUrl: 'https://api-moonbase.moonscan.io'
        }
      }
    }
  },
};