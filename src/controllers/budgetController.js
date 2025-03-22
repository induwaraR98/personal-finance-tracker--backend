const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

// Create a new budget
exports.createBudget = async (req, res) => {
    try {
        const { category, limit, startDate, endDate } = req.body;

        const newBudget = new Budget({
            userId: req.user.id, // From JWT token
            category,
            limit,
            startDate,
            endDate,
        });

        const savedBudget = await newBudget.save();
        res.status(201).json(savedBudget);
    } catch (err) {
        res.status(400).json({ message: 'Error creating budget', error: err.message });
    }
};

// Get all budgets for the logged-in user
exports.getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ userId: req.user.id });
        res.status(200).json(budgets);
    } catch (err) {
        res.status(400).json({ message: 'Error fetching budgets', error: err.message });
    }
};

// Get a single budget by ID
exports.getBudgetById = async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.id);
        if (!budget) return res.status(404).json({ message: 'Budget not found' });
        res.status(200).json(budget);
    } catch (err) {
        res.status(400).json({ message: 'Error fetching budget', error: err.message });
    }
};

// Update a budget
exports.updateBudget = async (req, res) => {
    try {
        const updatedBudget = await Budget.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true }
        );
        if (!updatedBudget) return res.status(404).json({ message: 'Budget not found' });
        res.status(200).json(updatedBudget);
    } catch (err) {
        res.status(400).json({ message: 'Error updating budget', error: err.message });
    }
};

// Delete a budget
exports.deleteBudget = async (req, res) => {
    try {
        const deletedBudget = await Budget.findByIdAndDelete(req.params.id);
        if (!deletedBudget) return res.status(404).json({ message: 'Budget not found' });
        res.status(200).json({ message: 'Budget deleted' });
    } catch (err) {
        res.status(400).json({ message: 'Error deleting budget', error: err.message });
    }
};


// Check if any budget limit has been exceeded
exports.checkBudgetStatus = async (req, res) => {
    try {
        // Get budgets for the logged-in user
        const budgets = await Budget.find({ userId: req.user.id });

        // Get transactions for the logged-in user and within the date range of their budgets
        const transactions = await Transaction.aggregate([
            { $match: { userId: req.user.id } },
            { $group: { _id: "$category", totalSpent: { $sum: "$amount" } } },
        ]);

        // Check if total spending exceeds any budget limit
        const result = budgets.map(budget => {
            const categoryTotal = transactions.find(t => t._id === budget.category)?.totalSpent || 0;
            return {
                category: budget.category,
                limit: budget.limit,
                spent: categoryTotal,
                exceeded: categoryTotal > budget.limit,
            };
        });

        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ message: 'Error checking budget status', error: err.message });
    }
};

const { sendNotification } = require('./NotificationController');

const checkBudgetLimit = async (userId, category, amount) => {
    const budget = await Budget.findOne({ userId, category });

    if (budget && amount > budget.limit) {
        await sendNotification(userId, 'BUDGET', ` You have exceeded your budget limit for ${category}.`);
    }
};
