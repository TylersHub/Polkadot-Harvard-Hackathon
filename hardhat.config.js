require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();                 // <-- add this

module.exports = {
  solidity: "0.8.28",
  networks: {
    // already-working local chain
    localhost: { url: "http://127.0.0.1:8545" },

    // NEW Moonbase Alpha testnet
    moonbase: {
      url: process.env.RPC_URL,
      chainId: 1287,                         // fixed for Moonbase Alpha
      accounts: [process.env.PRIVATE_KEY],   // 1-element array
    },
  },
};
