async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  // Check if environment variables are set
  const usdt = process.env.USDT_ADDRESS;
  const usdc = process.env.USDC_ADDRESS;
  
  if (!usdt || !usdc) {
    console.error("ERROR: USDT_ADDRESS or USDC_ADDRESS not defined in environment");
    console.log("Deploying mock tokens instead...");
    
    // Deploy mock tokens if addresses aren't provided
    const ERC20Mock = await ethers.getContractFactory("ERC20Mock");
    
    const mockUsdt = await ERC20Mock.deploy("USDT Mock", "USDT", 6);
    await mockUsdt.deployed();
    console.log("Mock USDT deployed to:", mockUsdt.address);
    
    const mockUsdc = await ERC20Mock.deploy("USDC Mock", "USDC", 6);
    await mockUsdc.deployed();
    console.log("Mock USDC deployed to:", mockUsdc.address);
    
    // Deploy GapLoan with mock tokens
    const GL = await ethers.getContractFactory("GapLoan");
    const loan = await GL.deploy(mockUsdt.address, mockUsdc.address);
    await loan.deployed();
    console.log("GapLoan deployed to:", loan.address);
  } else {
    // Deploy GapLoan with provided token addresses
    console.log("Using token addresses from environment:");
    console.log("- USDT:", usdt);
    console.log("- USDC:", usdc);
    
    const GL = await ethers.getContractFactory("GapLoan");
    const loan = await GL.deploy(usdt, usdc);
    await loan.deployed();
    console.log("GapLoan deployed to:", loan.address);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });