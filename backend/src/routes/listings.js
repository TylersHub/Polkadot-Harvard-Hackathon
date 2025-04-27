const r = require("express").Router();
const c = require("../controllers/listingController");
r.get("/", c.all);
r.post("/", c.create);
module.exports = r;