const mongoose = require("mongoose");
const Listing = require("./models/Listing");

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Listing.deleteMany({});
  await Listing.insertMany([
    { loanId: 1, borrower: "0x111…", principal: "1000000000000000000", interestBps: 800, maturity: 1700000000, funded: "500000000000000000" },
    { loanId: 2, borrower: "0x222…", principal: "2000000000000000000", interestBps: 1200, maturity: 1710000000, funded: "0" }
  ]);
  console.log("Mock data inserted"); process.exit(0);
})();