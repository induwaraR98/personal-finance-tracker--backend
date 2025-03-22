const Transaction = require('../models/Transaction');
const {sendNotification} = require('../utils/notificationUtils')

// Create a new transaction
exports.createTransaction = async (req, res) => {
    try {
        const { type, amount, currency, exchangeRate, category, tags, isRecurring, recurrencePattern, recurrenceEndDate } = req.body;

        // Validate the amount and exchangeRate
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        if (currency !== "USD" && (isNaN(exchangeRate) || exchangeRate <= 0)) {
            return res.status(400).json({ message: 'Invalid exchange rate' });
        }

        // Convert amount to USD using exchange rate
        const convertedAmount = currency === "USD" ? amount : amount * exchangeRate;

        const newTransaction = new Transaction({
            user: req.user.id, // User ID from JWT token
            type,
            amount,
            currency,
            exchangeRate,
            convertedAmount,
            category,
            tags,
            isRecurring,
            recurrencePattern,
            recurrenceEndDate,
        });

        const savedTransaction = await newTransaction.save();

        const userId = req.user.id;
        await sendNotification(
            userId,
            "You're 75% towards achieving your goal! Keep going!",
            "goal"
          );

        // Detect unusual spending (only for expenses)
        if (type === "expense") {
            await detectUnusualSpending(req.user.id, category, amount);
        }

        res.status(201).json(savedTransaction);
    } catch (err) {
        res.status(400).json({ message: 'Error creating transaction', error: err.message });
    }
};

// Get all transactions for the logged-in user
exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
        res.status(200).json(transactions);
    } catch (err) {
        res.status(400).json({ message: 'Error fetching transactions', error: err.message });
    }
};

// Get a single transaction by ID
exports.getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
        res.status(200).json(transaction);
    } catch (err) {
        res.status(400).json({ message: 'Error fetching transaction', error: err.message });
    }
};

// Update a transaction
exports.updateTransaction = async (req, res) => {
    try {
        const { amount, currency, exchangeRate } = req.body;

        // Validate the amount and exchangeRate
        if (amount && (isNaN(amount) || amount <= 0)) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        if (currency !== "USD" && (isNaN(exchangeRate) || exchangeRate <= 0)) {
            return res.status(400).json({ message: 'Invalid exchange rate' });
        }

        // Convert updated amount to USD
        if (amount && currency && exchangeRate) {
            req.body.convertedAmount = currency === "USD" ? amount : amount * exchangeRate;
        }

        const updatedTransaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true }
        );

        if (!updatedTransaction) return res.status(404).json({ message: 'Transaction not found' });

        res.status(200).json(updatedTransaction);
    } catch (err) {
        res.status(400).json({ message: 'Error updating transaction', error: err.message });
    }
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
    try {
        const deletedTransaction = await Transaction.findByIdAndDelete(req.params.id);
        if (!deletedTransaction) return res.status(404).json({ message: 'Transaction not found' });

        res.status(200).json({ message: 'Transaction deleted' });
    } catch (err) {
        res.status(400).json({ message: 'Error deleting transaction', error: err.message });
    }
};

// Detect unusual spending based on past transactions
const detectUnusualSpending = async (userId, category, amount) => {
    try {
        const avgSpending = await Transaction.aggregate([
            { $match: { user: userId, category, type: "expense" } }, // Only consider expenses
            { $group: { _id: "$category", avgAmount: { $avg: "$amount" } } }
        ]);

        // If there's no prior spending data, skip the check
        if (avgSpending.length === 0) return;

        const threshold = avgSpending[0].avgAmount * 1.5;

        if (amount > threshold) {
            await sendNotification(userId, 'TRANSACTION', `Unusual spending detected in ${category}: ${amount}`);
        }
    } catch (err) {
        console.error("Error detecting unusual spending:", err.message);
    }
};

// Placeholder function for sending notifications (you can define it based on your system)
// const sendNotification = (userId, type, message) => {
//     // Implement notification logic here (e.g., send an email, push notification, etc.)
//     console.log(`Notification to user ${userId}: ${message}`);
// };
