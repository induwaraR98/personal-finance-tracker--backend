const express = require('express');
const {
    createGoal,
    getGoals,
    getGoalById,
    updateGoal,
    deleteGoal,
} = require('../controllers/goalController');
const { authenticateUser } = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new goal
router.post('/', authenticateUser, createGoal);

// Get all goals for the logged-in user
router.get('/', authenticateUser, getGoals);

// Get a single goal by ID
router.get('/:id', authenticateUser, getGoalById);

// Update a goal
router.put('/:id', authenticateUser, updateGoal);

// Delete a goal
router.delete('/:id', authenticateUser, deleteGoal);

module.exports = router;
