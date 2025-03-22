// transactionController.integration.test.js
const request = require('supertest');// Import supertest for making API requests
const app = require('../server'); // Assuming app.js is the entry point
const Transaction = require('../models/Transaction');
const { disconnect, connect } = require('../db'); // Mocking database connection setup

describe('Transaction API - Integration Test', () => {
    beforeAll(async () => {
        await connect(); // Ensure the DB is connected before running tests
    });

    afterAll(async () => {
        await disconnect(); // Disconnect from DB after tests are complete
    });

    it('should create a new transaction', async () => {
        // Define a new transaction object
        const newTransaction = {
            type: 'expense',
            amount: 100, // Valid transaction amount
            currency: 'USD',
            exchangeRate: 1,
            category: 'Food',
            tags: ['groceries'],
            isRecurring: false,
            recurrencePattern: null,
            recurrenceEndDate: null
        };
        // Send a POST request to create a new transaction
        const response = await request(app)
            .post('/api/transactions')
            .send(newTransaction)
            .set('Authorization', 'Bearer valid-token'); // Replace with a valid token
        // Assertions: Check if the response status is 201 (Created)
        expect(response.status).toBe(201);
        expect(response.body.amount).toBe(newTransaction.amount);
        expect(response.body.currency).toBe(newTransaction.currency);
    });

    it('should return error for invalid transaction amount', async () => {
        const invalidTransaction = {
            type: 'expense',
            amount: -50,  // Invalid amount
            currency: 'USD',
            exchangeRate: 1,
            category: 'Food',
            tags: ['groceries'],
            isRecurring: false,
            recurrencePattern: null,
            recurrenceEndDate: null
        };

        const response = await request(app)
            .post('/api/transactions')
            .send(invalidTransaction)
            .set('Authorization', 'Bearer valid-token'); // Replace with a valid token
        // Assertions: Check if the response status is 400 (Bad Request)
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid amount');
    });

    it('should retrieve all transactions for a user', async () => {
        const response = await request(app)
            .get('/api/transactions')
            .set('Authorization', 'Bearer valid-token'); // Replace with a valid token

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array); // Ensure that the response is an array of transactions
    });
});
