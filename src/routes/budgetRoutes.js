const express = require('express');
const {
    createBudget,
    getBudgets,
    getBudgetById,
    updateBudget,
    deleteBudget,
} = require('../controllers/budgetController');
const { authenticateUser } = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new budget
router.post('/', authenticateUser, createBudget);

// Get all budgets for the logged-in user
router.get('/', authenticateUser, getBudgets);

// Get a single budget by ID
router.get('/:id', authenticateUser, getBudgetById);

// Update a budget
router.put('/:id', authenticateUser, updateBudget);

// Delete a budget
router.delete('/:id', authenticateUser, deleteBudget);

module.exports = router;
