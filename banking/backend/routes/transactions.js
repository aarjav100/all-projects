const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { auth } = require('../middleware/auth');
const { validate, transactionSchemas } = require('../middleware/validation');

// All routes require authentication
router.use(auth);

// Get user transactions
router.get('/', transactionController.getUserTransactions);

// Get transaction by ID
router.get('/:id', transactionController.getTransactionById);

// Create new transaction
router.post('/', validate(transactionSchemas.create), transactionController.createTransaction);

// Transfer money to beneficiary
router.post('/transfer', transactionController.transferMoney);

// Get transaction statistics
router.get('/stats/summary', transactionController.getTransactionStats);

module.exports = router; 