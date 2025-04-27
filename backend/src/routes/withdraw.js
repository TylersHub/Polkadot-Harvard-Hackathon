const router = require("express").Router();
const withdrawCtrl = require("../controllers/withdrawController");

// POST /api/withdraw  →  trigger interest-payout withdraw
router.post("/", withdrawCtrl.handleWithdraw);

module.exports = router;