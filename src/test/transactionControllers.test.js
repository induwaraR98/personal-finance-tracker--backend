// transactionController.test.js
const { createTransaction, getTransactions } = require('../controllers/transactionController');
const Transaction = require('../models/Transaction');

jest.mock('../models/Transaction');

describe('Transaction Controller - Unit Tests', () => {
    it('should create a transaction successfully', async () => {
        const req = {
            body: {
                type: 'expense',
                amount: 100,
                currency: 'USD',
                exchangeRate: 1,
                category: 'Food',
                tags: ['groceries'],
                isRecurring: false,
                recurrencePattern: null,
                recurrenceEndDate: null
            },
            user: { id: 'user123' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        Transaction.prototype.save = jest.fn().mockResolvedValue(req.body);  // Mock save function

        await createTransaction(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(req.body);
    });

    it('should return an error for invalid amount', async () => {
        const req = {
            body: {
                type: 'expense',
                amount: -50,  // Invalid amount
                currency: 'USD',
                exchangeRate: 1,
                category: 'Food',
                tags: ['groceries'],
                isRecurring: false,
                recurrencePattern: null,
                recurrenceEndDate: null
            },
            user: { id: 'user123' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await createTransaction(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid amount' });
    });
});
