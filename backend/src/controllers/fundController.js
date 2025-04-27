const { ethers } = require("ethers");
const Listing = require("./listingController").Model; // reuse the same model
require("dotenv").config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const signer   = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const abi      = [
  "function fund(uint256) payable",
  "function fundToken(uint256,uint256,bool)"
];
const loan = new ethers.Contract(process.env.CONTRACT_ADDR, abi, signer);

exports.handleFund = async (req, res) => {
  try {
    const { loanId, investor, amount, useUSDC } = req.body;

    // --- 1. write on-chain --------------------------------------------------
    let tx;
    if (useUSDC) {
      tx = await loan.fundToken(loanId, amount, true, { gasLimit: 300_000 });
    } else {
      tx = await loan.fund(loanId, { value: amount, gasLimit: 300_000 });
    }
    await tx.wait();

    // --- 2. persist in Mongo -------------------------------------------------
    await Listing.updateOne(
      { loanId },
      { $inc: { funded: amount } },
      { upsert: false }
    );

    res.json({ txHash: tx.hash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};