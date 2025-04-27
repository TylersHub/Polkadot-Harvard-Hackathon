const { Schema, model } = require("mongoose");
module.exports = model("Listing", new Schema({
  loanId: Number,
  borrower: String,
  principal: String,
  interestBps: Number,
  maturity: Number,
  funded: String
}));
