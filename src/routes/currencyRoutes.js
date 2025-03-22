const express = require("express");
const { getCurrencyRate } = require("../controllers/currencyController");

const router = express.Router();

router.get("/:currency", getCurrencyRate);

module.exports = router;
