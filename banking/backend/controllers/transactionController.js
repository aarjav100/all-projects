const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Beneficiary = require('../models/Beneficiary');

// Get user transactions
const getUserTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, status, startDate, endDate } = req.query;
    
    const query = { userId: req.user._id };
    
    // Add filters
    if (type) query.type = type;
    if (status) query.status = status;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('userId', 'fullName accountNumber');

    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get transaction by ID
const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('userId', 'fullName accountNumber');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      data: {
        transaction
      }
    });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Create new transaction
const createTransaction = async (req, res) => {
  try {
    const { type, amount, description, category, recipientAccount, recipientName } = req.body;

    // Get current user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has sufficient balance for withdrawal/transfer
    if ((type === 'withdrawal' || type === 'transfer') && user.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    // Calculate new balance
    let newBalance = user.balance;
    if (type === 'deposit') {
      newBalance += amount;
    } else if (type === 'withdrawal' || type === 'transfer') {
      newBalance -= amount;
    }

    // Create transaction
    const transaction = new Transaction({
      userId: req.user._id,
      type,
      amount,
      description,
      category,
      recipientAccount,
      recipientName,
      senderAccount: user.accountNumber,
      senderName: user.fullName,
      balanceAfter: newBalance,
      status: 'completed',
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        deviceType: req.get('User-Agent')?.includes('Mobile') ? 'mobile' : 'desktop'
      }
    });

    await transaction.save();

    // Update user balance
    user.balance = newBalance;
    await user.save();

    // Populate user data for response
    await transaction.populate('userId', 'fullName accountNumber');

    // Realtime notifications removed

    res.status(201).json({
      success: true,
      message: 'Transaction completed successfully',
      data: {
        transaction,
        newBalance
      }
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Transfer money to beneficiary
const transferMoney = async (req, res) => {
  try {
    const { beneficiaryId, amount, description } = req.body;

    // Get beneficiary
    const beneficiary = await Beneficiary.findOne({
      _id: beneficiaryId,
      userId: req.user._id,
      status: 'active'
    });

    if (!beneficiary) {
      return res.status(404).json({
        success: false,
        message: 'Beneficiary not found or inactive'
      });
    }

    // Check transfer limits
    const transferCheck = beneficiary.canTransfer(amount);
    if (!transferCheck.allowed) {
      return res.status(400).json({
        success: false,
        message: transferCheck.reason
      });
    }

    // Get current user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has sufficient balance
    if (user.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    // Calculate new balance
    const newBalance = user.balance - amount;

    // Create transaction
    const transaction = new Transaction({
      userId: req.user._id,
      type: 'transfer',
      amount,
      description: description || `Transfer to ${beneficiary.name}`,
      category: 'transfer',
      recipientAccount: beneficiary.accountNumber,
      recipientName: beneficiary.name,
      senderAccount: user.accountNumber,
      senderName: user.fullName,
      balanceAfter: newBalance,
      status: 'completed',
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        deviceType: req.get('User-Agent')?.includes('Mobile') ? 'mobile' : 'desktop'
      }
    });

    await transaction.save();

    // Update user balance
    user.balance = newBalance;
    await user.save();

    // Update beneficiary transfer stats
    await beneficiary.updateTransferStats(amount);

    // Populate user data for response
    await transaction.populate('userId', 'fullName accountNumber');

    // Realtime notifications removed

    res.status(201).json({
      success: true,
      message: 'Transfer completed successfully',
      data: {
        transaction,
        newBalance,
        beneficiary: {
          id: beneficiary._id,
          name: beneficiary.name,
          accountNumber: beneficiary.accountNumber
        }
      }
    });
  } catch (error) {
    console.error('Transfer money error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get transaction statistics
const getTransactionStats = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    let startDate;
    const endDate = new Date();
    
    switch (period) {
      case 'week':
        startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(endDate.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
    }

    const transactions = await Transaction.find({
      userId: req.user._id,
      createdAt: { $gte: startDate, $lte: endDate },
      status: 'completed'
    });

    // Calculate statistics
    const stats = {
      totalTransactions: transactions.length,
      totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
      deposits: transactions.filter(t => t.type === 'deposit').length,
      withdrawals: transactions.filter(t => t.type === 'withdrawal').length,
      transfers: transactions.filter(t => t.type === 'transfer').length,
      depositAmount: transactions.filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0),
      withdrawalAmount: transactions.filter(t => t.type === 'withdrawal').reduce((sum, t) => sum + t.amount, 0),
      transferAmount: transactions.filter(t => t.type === 'transfer').reduce((sum, t) => sum + t.amount, 0)
    };

    // Category breakdown
    const categoryStats = {};
    transactions.forEach(transaction => {
      const category = transaction.category;
      if (!categoryStats[category]) {
        categoryStats[category] = { count: 0, amount: 0 };
      }
      categoryStats[category].count++;
      categoryStats[category].amount += transaction.amount;
    });

    res.json({
      success: true,
      data: {
        stats,
        categoryStats,
        period,
        startDate,
        endDate
      }
    });
  } catch (error) {
    console.error('Get transaction stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getUserTransactions,
  getTransactionById,
  createTransaction,
  transferMoney,
  getTransactionStats
}; 