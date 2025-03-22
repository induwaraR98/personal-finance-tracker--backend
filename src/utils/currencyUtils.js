const axios = require("axios");

const getExchangeRate = async (currency) => {
  try {
    if (currency === "USD") return 1; // Base currency

    const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/USD`);
    return response.data.rates[currency] || 1;
  } catch (error) {
    console.error("Error fetching exchange rates:", error.message);
    return 1;
  }
};

module.exports = { getExchangeRate };
