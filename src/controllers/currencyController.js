const { getExchangeRate } = require("../utils/currencyUtils");

// @desc   Get exchange rate for a specific currency
// @route  GET /api/currency/:currency
const getCurrencyRate = async (req, res) => {
  try {
    const { currency } = req.params;
    const exchangeRate = await getExchangeRate(currency);

    res.json({ currency, exchangeRate });
  } catch (error) {
    res.status(500).json({ message: "Error fetching exchange rate", error: error.message });
  }
};

module.exports = { getCurrencyRate };
