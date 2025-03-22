const Goal = require('../models/Goal');

// Create a new goal
exports.createGoal = async (req, res) => {
    try {
        const { title, targetAmount, deadline } = req.body;

        const newGoal = new Goal({
            userId: req.user.id, // From JWT token
            title,
            targetAmount,
            deadline,
        });

        const savedGoal = await newGoal.save();
        res.status(201).json(savedGoal);
    } catch (err) {
        res.status(400).json({ message: 'Error creating goal', error: err.message });
    }
};

// Get all goals for the logged-in user
exports.getGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ userId: req.user.id });
        res.status(200).json(goals);
    } catch (err) {
        res.status(400).json({ message: 'Error fetching goals', error: err.message });
    }
};

// Get a single goal by ID
exports.getGoalById = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);
        if (!goal) return res.status(404).json({ message: 'Goal not found' });
        res.status(200).json(goal);
    } catch (err) {
        res.status(400).json({ message: 'Error fetching goal', error: err.message });
    }
};

// Update a goal
exports.updateGoal = async (req, res) => {
    try {
        const updatedGoal = await Goal.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true }
        );
        if (!updatedGoal) return res.status(404).json({ message: 'Goal not found' });
        res.status(200).json(updatedGoal);
    } catch (err) {
        res.status(400).json({ message: 'Error updating goal', error: err.message });
    }
};

// Delete a goal
exports.deleteGoal = async (req, res) => {
    try {
        const deletedGoal = await Goal.findByIdAndDelete(req.params.id);
        if (!deletedGoal) return res.status(404).json({ message: 'Goal not found' });
        res.status(200).json({ message: 'Goal deleted' });
    } catch (err) {
        res.status(400).json({ message: 'Error deleting goal', error: err.message });
    }
};
