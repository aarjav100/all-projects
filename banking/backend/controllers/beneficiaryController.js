const Beneficiary = require('../models/Beneficiary');

// Get user beneficiaries
const getUserBeneficiaries = async (req, res) => {
  try {
    const { status } = req.query;
    
    const query = { userId: req.user._id };
    if (status) query.status = status;

    const beneficiaries = await Beneficiary.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        beneficiaries
      }
    });
  } catch (error) {
    console.error('Get beneficiaries error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get beneficiary by ID
const getBeneficiaryById = async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!beneficiary) {
      return res.status(404).json({
        success: false,
        message: 'Beneficiary not found'
      });
    }

    res.json({
      success: true,
      data: {
        beneficiary
      }
    });
  } catch (error) {
    console.error('Get beneficiary error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Create new beneficiary
const createBeneficiary = async (req, res) => {
  try {
    const {
      name,
      accountNumber,
      bankName,
      bankCode,
      routingNumber,
      email,
      phone,
      nickname,
      transferLimit,
      dailyLimit,
      monthlyLimit,
      notes
    } = req.body;

    // Check if beneficiary already exists for this user
    const existingBeneficiary = await Beneficiary.findOne({
      userId: req.user._id,
      accountNumber
    });

    if (existingBeneficiary) {
      return res.status(400).json({
        success: false,
        message: 'Beneficiary with this account number already exists'
      });
    }

    const beneficiary = new Beneficiary({
      userId: req.user._id,
      name,
      accountNumber,
      bankName,
      bankCode,
      routingNumber,
      email,
      phone,
      nickname,
      transferLimit,
      dailyLimit,
      monthlyLimit,
      notes,
      status: 'pending' // Will be verified by admin or through verification process
    });

    await beneficiary.save();

    res.status(201).json({
      success: true,
      message: 'Beneficiary added successfully',
      data: {
        beneficiary
      }
    });
  } catch (error) {
    console.error('Create beneficiary error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Beneficiary with this account number already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update beneficiary
const updateBeneficiary = async (req, res) => {
  try {
    const {
      name,
      bankName,
      bankCode,
      routingNumber,
      email,
      phone,
      nickname,
      transferLimit,
      dailyLimit,
      monthlyLimit,
      status,
      notes
    } = req.body;

    const beneficiary = await Beneficiary.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id
      },
      {
        name,
        bankName,
        bankCode,
        routingNumber,
        email,
        phone,
        nickname,
        transferLimit,
        dailyLimit,
        monthlyLimit,
        status,
        notes
      },
      { new: true, runValidators: true }
    );

    if (!beneficiary) {
      return res.status(404).json({
        success: false,
        message: 'Beneficiary not found'
      });
    }

    res.json({
      success: true,
      message: 'Beneficiary updated successfully',
      data: {
        beneficiary
      }
    });
  } catch (error) {
    console.error('Update beneficiary error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete beneficiary
const deleteBeneficiary = async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!beneficiary) {
      return res.status(404).json({
        success: false,
        message: 'Beneficiary not found'
      });
    }

    res.json({
      success: true,
      message: 'Beneficiary deleted successfully'
    });
  } catch (error) {
    console.error('Delete beneficiary error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Verify beneficiary (admin function)
const verifyBeneficiary = async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findByIdAndUpdate(
      req.params.id,
      {
        isVerified: true,
        verificationDate: new Date(),
        status: 'active'
      },
      { new: true }
    );

    if (!beneficiary) {
      return res.status(404).json({
        success: false,
        message: 'Beneficiary not found'
      });
    }

    res.json({
      success: true,
      message: 'Beneficiary verified successfully',
      data: {
        beneficiary
      }
    });
  } catch (error) {
    console.error('Verify beneficiary error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get beneficiary transfer history
const getBeneficiaryTransferHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const beneficiary = await Beneficiary.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!beneficiary) {
      return res.status(404).json({
        success: false,
        message: 'Beneficiary not found'
      });
    }

    // This would typically query the Transaction model
    // For now, we'll return the beneficiary's transfer statistics
    res.json({
      success: true,
      data: {
        beneficiary: {
          id: beneficiary._id,
          name: beneficiary.name,
          accountNumber: beneficiary.accountNumber,
          bankName: beneficiary.bankName,
          totalTransferred: beneficiary.totalTransferred,
          transferCount: beneficiary.transferCount,
          lastTransferDate: beneficiary.lastTransferDate,
          transferLimit: beneficiary.transferLimit,
          dailyLimit: beneficiary.dailyLimit,
          monthlyLimit: beneficiary.monthlyLimit
        }
      }
    });
  } catch (error) {
    console.error('Get beneficiary transfer history error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getUserBeneficiaries,
  getBeneficiaryById,
  createBeneficiary,
  updateBeneficiary,
  deleteBeneficiary,
  verifyBeneficiary,
  getBeneficiaryTransferHistory
}; 