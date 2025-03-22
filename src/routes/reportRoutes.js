const express = require('express');
const {
    getSpendingTrends,
    getIncomeVsExpenses,
    getFilteredTransactions
} = require('../controllers/reportController');
const { authenticateUser } = require('../middleware/authMiddleware');

const router = express.Router();

// Route: Get Spending Trends Over Time
router.get('/spending-trends', authenticateUser, getSpendingTrends);

// Route: Get Income vs. Expenses Summary
router.get('/income-vs-expenses', authenticateUser, getIncomeVsExpenses);

// Route: Get Filtered Transactions Report
router.get('/filtered-transactions', authenticateUser, getFilteredTransactions);

module.exports = router;
