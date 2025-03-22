const Transaction = require('../models/Transaction');


// Get Spending Trends Over Time
exports.getSpendingTrends = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(400).json({ message: "User ID missing in request" });
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);
        const { startDate, endDate } = req.query;

        const matchCriteria = {
            user: userObjectId,
            type: "expense",
        };

        if (startDate && endDate) {
            matchCriteria.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        console.log("Spending Trends Match Criteria:", matchCriteria); // Debugging

        const trends = await Transaction.aggregate([
            { $match: matchCriteria },
            {
                $group: {
                    _id: { $month: "$date" }, // Group by month
                    totalSpent: { $sum: "$amount" },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        console.log("Spending Trends Result:", trends); // Debugging
        res.status(200).json(trends);
    } catch (err) {
        console.error("Error fetching spending trends:", err);
        res.status(500).json({ message: "Error fetching spending trends", error: err.message });
    }
};
// Get Income vs Expenses
const mongoose = require("mongoose");

exports.getIncomeVsExpenses = async (req, res) => {
    try {
        const userId = req.user?.id;
        console.log("Authenticated User ID:", userId);

        if (!userId) {
            return res.status(400).json({ message: "User ID missing in request" });
        }

        // Convert userId to ObjectId
        const matchCriteria = { user: new mongoose.Types.ObjectId(userId) };

        const transactions = await Transaction.find(matchCriteria);
        console.log("Transactions Found:", transactions);

        // Debug the existing transaction types
        const types = await Transaction.distinct("type", { user: userId });
        console.log("Existing Transaction Types for User:", types);

        if (transactions.length === 0) {
            return res.status(404).json({ message: "No transactions found for this user." });
        }

        const summary = await Transaction.aggregate([
            { $match: matchCriteria },
            {
                $group: {
                    _id: "$type",
                    totalAmount: { $sum: "$amount" },
                },
            },
        ]);

        console.log("Aggregation Result:", summary);

        const income = summary.find(s => s._id === 'income')?.totalAmount || 0;
        const expense = summary.find(s => s._id === 'expense')?.totalAmount || 0;

        res.status(200).json({ income, expense, balance: income - expense });
    } catch (err) {
        console.error("Error fetching income vs expenses:", err);
        res.status(500).json({ message: "Error fetching income vs expenses summary", error: err.message });
    }
};

exports.getFilteredTransactions = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id); // Convert userId to ObjectId
        const { startDate, endDate, category, tags } = req.query;

        const matchCriteria = { user: userId };  // Use "user" instead of "userId"

        // Check for valid date range
        if (startDate && endDate) {
            matchCriteria.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        // Check for category filter
        if (category) matchCriteria.category = category;

        // Check for tags filter
        if (tags) matchCriteria.tags = { $in: tags.split(',') };

        console.log("Filtered Transactions Match Criteria:", matchCriteria);  // Debugging

        const transactions = await Transaction.find(matchCriteria).sort({ date: -1 });

        console.log("Filtered Transactions Result:", transactions);  // Debugging
        res.status(200).json(transactions);
    } catch (err) {
        console.error("Error fetching transactions:", err);
        res.status(500).json({ message: "Error fetching transactions", error: err.message });
    }
};
