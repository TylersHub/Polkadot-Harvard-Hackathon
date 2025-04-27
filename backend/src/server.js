require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const listings = require("./routes/listings");
const fund = require("./routes/fund");
const withdraw = require("./routes/withdraw");

const app = express();
app.use(cors(), express.json());
app.use("/api/listings", listings);
app.use("/api/fund", fund);
app.use("/api/withdraw", withdraw);

mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(4000, ()=> console.log("API@4000"));
});