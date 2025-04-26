const hre = require("hardhat");

async function main() {
  const GapFinance = await hre.ethers.getContractFactory("GapFinance");
  const gapFinance = await GapFinance.deploy();
  await gapFinance.deployed();

  console.log("GapFinance deployed to:", gapFinance.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });