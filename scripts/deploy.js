const hre = require("hardhat");

async function main() {
  // Show exactly which account Hardhat injected
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // Compile only if artifacts are out of date
  await hre.run("compile");

  // Get factory & deploy
  const ONE_YEAR = 365 * 24 * 60 * 60;
  const unlock   = Math.floor(Date.now() / 1000) + ONE_YEAR;

  const Lock = await hre.ethers.getContractFactory("Lock");
  const lock = await Lock.deploy(unlock);         // no value for simplicity
  await lock.waitForDeployment();

  console.log("Lock deployed to:", await lock.getAddress());
}

main().catch((err) => { console.error(err); process.exitCode = 1; });
