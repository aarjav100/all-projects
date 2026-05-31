import express from 'express';
import { body, validationResult } from 'express-validator';
import { supabase } from '../config/supabase.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get user's fees
// @route   GET /api/fees/my
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const { data: fees, error } = await supabase
      .from('fees')
      .select('*')
      .eq('student_id', req.user.id)
      .order('due_date', { ascending: true });

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Error fetching fees',
      });
    }

    res.json({
      success: true,
      data: fees,
    });
  } catch (error) {
    console.error('Get fees error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching fees',
    });
  }
});

// @desc    Get all fees (admin only)
// @route   GET /api/fees
// @access  Private/Admin
router.get('/', protect, async (req, res) => {
  try {
    const { data: fees, error } = await supabase
      .from('fees')
      .select(`
        *,
        profiles (*)
      `)
      .order('due_date', { ascending: true });

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Error fetching fees',
      });
    }

    res.json({
      success: true,
      data: fees,
    });
  } catch (error) {
    console.error('Get all fees error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching fees',
    });
  }
});

// @desc    Create fee record (admin only)
// @route   POST /api/fees
// @access  Private/Admin
router.post('/', [
  protect,
  body('student_id').isUUID(),
  body('amount').isFloat({ min: 0 }),
  body('fee_type').isIn(['tuition', 'library', 'laboratory', 'other']),
  body('due_date').isISO8601(),
  body('description').optional().trim(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: errors.array(),
      });
    }

    const { data: fee, error } = await supabase
      .from('fees')
      .insert([{
        ...req.body,
        status: 'pending',
        paid_amount: 0,
      }])
      .select(`
        *,
        profiles (*)
      `)
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Fee record created successfully',
      data: fee,
    });
  } catch (error) {
    console.error('Create fee error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error creating fee record',
    });
  }
});

// @desc    Update fee payment
// @route   PUT /api/fees/:id/pay
// @access  Private
router.put('/:id/pay', [
  protect,
  body('paid_amount').isFloat({ min: 0 }),
  body('payment_method').isIn(['cash', 'card', 'bank_transfer', 'online']),
  body('transaction_id').optional().trim(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: errors.array(),
      });
    }

    // Get current fee record
    const { data: currentFee, error: fetchError } = await supabase
      .from('fees')
      .select('*')
      .eq('id', req.params.id)
      .eq('student_id', req.user.id)
      .single();

    if (fetchError || !currentFee) {
      return res.status(404).json({
        success: false,
        error: 'Fee record not found',
      });
    }

    const newPaidAmount = currentFee.paid_amount + req.body.paid_amount;
    const status = newPaidAmount >= currentFee.amount ? 'paid' : 'partial';

    const { data: fee, error } = await supabase
      .from('fees')
      .update({
        paid_amount: newPaidAmount,
        status,
        payment_method: req.body.payment_method,
        transaction_id: req.body.transaction_id,
        paid_date: new Date().toISOString(),
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    res.json({
      success: true,
      message: 'Payment processed successfully',
      data: fee,
    });
  } catch (error) {
    console.error('Pay fee error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error processing payment',
    });
  }
});

// @desc    Get fee summary
// @route   GET /api/fees/summary
// @access  Private
router.get('/summary', protect, async (req, res) => {
  try {
    const { data: fees, error } = await supabase
      .from('fees')
      .select('*')
      .eq('student_id', req.user.id);

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Error fetching fee summary',
      });
    }

    const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0);
    const totalPaid = fees.reduce((sum, fee) => sum + fee.paid_amount, 0);
    const totalPending = totalFees - totalPaid;
    const overdueFees = fees.filter(fee => 
      fee.status !== 'paid' && new Date(fee.due_date) < new Date()
    ).length;

    res.json({
      success: true,
      data: {
        totalFees,
        totalPaid,
        totalPending,
        overdueFees,
        paymentPercentage: totalFees > 0 ? (totalPaid / totalFees) * 100 : 0,
      },
    });
  } catch (error) {
    console.error('Get fee summary error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching fee summary',
    });
  }
});

export default router; 