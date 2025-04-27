const { ethers } = require("ethers");
require("dotenv").config();

// Debug environment variables (you can remove this after fixing)
console.log("Environment variables:", {
  CONTRACT_ADDRESS: process.env.CONTRACT_ADDR,
  RPC_URL: process.env.RPC_URL,
  PRIVATE_KEY: process.env.PRIVATE_KEY ? "Set (hidden)" : "Not set"
});

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Make sure CONTRACT_ADDRESS is set in your .env file
const contractAddress = process.env.CONTRACT_ADDR;
if (!contractAddress) {
  throw new Error("CONTRACT_ADDRESS environment variable is not set");
}

// Update the ABI to match your contract
const abi = ["function withdraw(uint256 id)"];
const loan = new ethers.Contract(contractAddress, abi, signer);

/**
 * Body: { loanId }
 */
exports.handleWithdraw = async (req, res) => {
  try {
    const { loanId } = req.body;

    // Call withdraw with just the loanId parameter
    const tx = await loan.withdraw(loanId, {
      gasLimit: 300_000
    });
    await tx.wait();

    // Reply with tx hash
    res.json({ txHash: tx.hash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};