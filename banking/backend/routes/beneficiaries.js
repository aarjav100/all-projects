const express = require('express');
const router = express.Router();
const beneficiaryController = require('../controllers/beneficiaryController');
const { auth, adminAuth } = require('../middleware/auth');
const { validate, beneficiarySchemas } = require('../middleware/validation');

// All routes require authentication
router.use(auth);

// Get user beneficiaries
router.get('/', beneficiaryController.getUserBeneficiaries);

// Get beneficiary by ID
router.get('/:id', beneficiaryController.getBeneficiaryById);

// Create new beneficiary
router.post('/', validate(beneficiarySchemas.create), beneficiaryController.createBeneficiary);

// Update beneficiary
router.put('/:id', validate(beneficiarySchemas.update), beneficiaryController.updateBeneficiary);

// Delete beneficiary
router.delete('/:id', beneficiaryController.deleteBeneficiary);

// Get beneficiary transfer history
router.get('/:id/history', beneficiaryController.getBeneficiaryTransferHistory);

// Admin routes
router.put('/:id/verify', adminAuth, beneficiaryController.verifyBeneficiary);

module.exports = router; 