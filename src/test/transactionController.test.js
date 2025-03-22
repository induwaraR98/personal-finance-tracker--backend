const { createTransaction, getTransactions } = require('../controllers/transactionController');
const Transaction = require('../models/Transaction');
const mockSendNotification = jest.fn();
jest.mock('../controllers/transactionController', () => ({
    ...jest.requireActual('../controllers/transactionController'),
    sendNotification: mockSendNotification
}));

describe('Transaction Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    it('should create a new transaction successfully', async () => {
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

        // Mock the Transaction model's save function
        Transaction.prototype.save = jest.fn().mockResolvedValue(req.body);

        await createTransaction(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(req.body);
    });

    it('should return error for invalid amount', async () => {
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

    it('should get all transactions for a user', async () => {
        const req = {
            user: { id: 'user123' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Mock the Transaction model's find function to return a list of transactions
        const mockTransactions = [
            { amount: 100, currency: 'USD', category: 'Food' },
            { amount: 50, currency: 'USD', category: 'Transport' }
        ];
        Transaction.find = jest.fn().mockResolvedValue(mockTransactions);

        await getTransactions(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockTransactions);
    });

    it('should return error if transactions cannot be fetched', async () => {
        const req = {
            user: { id: 'user123' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Mocking error in find function
        Transaction.find = jest.fn().mockRejectedValue(new Error('Error fetching transactions'));

        await getTransactions(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching transactions' });
    });
});
