const Listing = require("../models/Listing");
exports.create = async (req,res) => {
  const doc = await Listing.create(req.body);
  res.json(doc);
};
exports.all = async (_req,res) => {
  res.json(await Listing.find());
};