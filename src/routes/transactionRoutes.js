const express = require('express');
const {
    createTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
} = require('../controllers/transactionController');
const { authenticateUser } = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new transaction
router.post('/', authenticateUser, createTransaction);

// Get all transactions for the logged-in user
router.get('/', authenticateUser, getTransactions);

// Get a single transaction by ID
router.get('/:id', authenticateUser, getTransactionById);

// Update a transaction
router.put('/:id', authenticateUser, updateTransaction);

// Delete a transaction
router.delete('/:id', authenticateUser, deleteTransaction);

module.exports = router;
