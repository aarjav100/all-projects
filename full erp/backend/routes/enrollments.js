import express from 'express';
import { body, validationResult } from 'express-validator';
import { supabase } from '../config/supabase.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all enrollments (admin only)
// @route   GET /api/enrollments
// @access  Private/Admin
router.get('/', protect, async (req, res) => {
  try {
    const { data: enrollments, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        profiles (*),
        courses (*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Error fetching enrollments',
      });
    }

    res.json({
      success: true,
      data: enrollments,
    });
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching enrollments',
    });
  }
});

// @desc    Get user's enrollments
// @route   GET /api/enrollments/my
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const { data: enrollments, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        courses (*)
      `)
      .eq('student_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Error fetching enrollments',
      });
    }

    res.json({
      success: true,
      data: enrollments,
    });
  } catch (error) {
    console.error('Get my enrollments error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching enrollments',
    });
  }
});

// @desc    Enroll in a course
// @route   POST /api/enrollments
// @access  Private
router.post('/', [
  protect,
  body('course_id').isUUID(),
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

    const { course_id } = req.body;

    // Check if already enrolled
    const { data: existingEnrollment } = await supabase
      .from('enrollments')
      .select('*')
      .eq('student_id', req.user.id)
      .eq('course_id', course_id)
      .single();

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        error: 'Already enrolled in this course',
      });
    }

    // Create enrollment
    const { data: enrollment, error } = await supabase
      .from('enrollments')
      .insert([{
        student_id: req.user.id,
        course_id,
        status: 'enrolled',
      }])
      .select(`
        *,
        courses (*)
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
      message: 'Enrolled successfully',
      data: enrollment,
    });
  } catch (error) {
    console.error('Enroll error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error enrolling in course',
    });
  }
});

// @desc    Update enrollment status (admin only)
// @route   PATCH /api/enrollments/:id
// @access  Private/Admin
router.patch('/:id', [
  protect,
  body('status').isIn(['enrolled', 'dropped', 'completed']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status value',
      });
    }

    const { data: enrollment, error } = await supabase
      .from('enrollments')
      .update({ status: req.body.status })
      .eq('id', req.params.id)
      .select(`
        *,
        courses (*)
      `)
      .single();

    if (error || !enrollment) {
      return res.status(404).json({
        success: false,
        error: 'Enrollment not found',
      });
    }

    res.json({
      success: true,
      message: 'Enrollment status updated successfully',
      data: enrollment,
    });
  } catch (error) {
    console.error('Update enrollment error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error updating enrollment',
    });
  }
});

// @desc    Drop enrollment
// @route   DELETE /api/enrollments/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const { data: enrollment, error } = await supabase
      .from('enrollments')
      .delete()
      .eq('id', req.params.id)
      .eq('student_id', req.user.id)
      .select()
      .single();

    if (error || !enrollment) {
      return res.status(404).json({
        success: false,
        error: 'Enrollment not found',
      });
    }

    res.json({
      success: true,
      message: 'Enrollment dropped successfully',
    });
  } catch (error) {
    console.error('Drop enrollment error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error dropping enrollment',
    });
  }
});

export default router; 