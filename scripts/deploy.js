const hre = require("hardhat");
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('EasyA x Polkadot Harvard Hackathon Project');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  await hre.run("compile");

  const ONE_YEAR = 365 * 24 * 60 * 60;
  const unlock = Math.floor(Date.now() / 1000) + ONE_YEAR;
  const ONE_GWEI = 1_000_000_000;

  const Lock = await hre.ethers.getContractFactory("Lock");
  const lock = await Lock.deploy(unlock, { value: ONE_GWEI });
  await lock.waitForDeployment();

  console.log("Lock deployed to:", await lock.getAddress());
}

main().catch((err) => { console.error(err); process.exitCode = 1; });

module.exports = {
  scripts: {
    dev: "nodemon index.js",
    start: "node index.js",
    deploy: "hardhat run scripts/deploy.js",
    deploy:moonbase: "hardhat run scripts/deploy.js --network moonbase",
    test: "hardhat test"
  }
};

node_modules
.env

# Hardhat files
/cache
/artifacts

# TypeChain files
/typechain
/typechain-types

# solidity-coverage files
/coverage
/coverage.json

# Hardhat Ignition deployments
ignition/deployments/chain-31337
