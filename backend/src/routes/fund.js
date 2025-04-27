const router = require("express").Router();
const fundCtrl = require("../controllers/fundController");

// POST /api/fund  →  record funding + forward to contract
router.post("/", fundCtrl.handleFund);

module.exports = router;