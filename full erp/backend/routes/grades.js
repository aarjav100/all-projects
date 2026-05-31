import express from 'express';
import { body, validationResult } from 'express-validator';
import { supabase } from '../config/supabase.js';
import { protect, admin, teacher } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get user's grades
// @route   GET /api/grades/my
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const { data: grades, error } = await supabase
      .from('grades')
      .select(`
        *,
        assignments (*),
        courses (*)
      `)
      .eq('student_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Error fetching grades',
      });
    }

    res.json({
      success: true,
      data: grades,
    });
  } catch (error) {
    console.error('Get grades error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching grades',
    });
  }
});

// @desc    Get all grades (admin/teacher only)
// @route   GET /api/grades
// @access  Private/Admin/Teacher
router.get('/', protect, async (req, res) => {
  try {
    const { data: grades, error } = await supabase
      .from('grades')
      .select(`
        *,
        profiles (*),
        assignments (*),
        courses (*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Error fetching grades',
      });
    }

    res.json({
      success: true,
      data: grades,
    });
  } catch (error) {
    console.error('Get all grades error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching grades',
    });
  }
});

// @desc    Add grade (admin/teacher only)
// @route   POST /api/grades
// @access  Private/Admin/Teacher
router.post('/', [
  protect,
  body('student_id').isUUID(),
  body('assignment_id').isUUID(),
  body('course_id').isUUID(),
  body('score').isInt({ min: 0 }),
  body('max_score').isInt({ min: 1 }),
  body('grade_letter').optional().trim(),
  body('feedback').optional().trim(),
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

    const { data: grade, error } = await supabase
      .from('grades')
      .insert([req.body])
      .select(`
        *,
        profiles (*),
        assignments (*),
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
      message: 'Grade added successfully',
      data: grade,
    });
  } catch (error) {
    console.error('Add grade error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error adding grade',
    });
  }
});

// @desc    Update grade (admin/teacher only)
// @route   PUT /api/grades/:id
// @access  Private/Admin/Teacher
router.put('/:id', [
  protect,
  body('score').optional().isInt({ min: 0 }),
  body('max_score').optional().isInt({ min: 1 }),
  body('grade_letter').optional().trim(),
  body('feedback').optional().trim(),
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

    const { data: grade, error } = await supabase
      .from('grades')
      .update(req.body)
      .eq('id', req.params.id)
      .select(`
        *,
        profiles (*),
        assignments (*),
        courses (*)
      `)
      .single();

    if (error || !grade) {
      return res.status(404).json({
        success: false,
        error: 'Grade not found',
      });
    }

    res.json({
      success: true,
      message: 'Grade updated successfully',
      data: grade,
    });
  } catch (error) {
    console.error('Update grade error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error updating grade',
    });
  }
});

// @desc    Delete grade (admin/teacher only)
// @route   DELETE /api/grades/:id
// @access  Private/Admin/Teacher
router.delete('/:id', protect, async (req, res) => {
  try {
    const { error } = await supabase
      .from('grades')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    res.json({
      success: true,
      message: 'Grade deleted successfully',
    });
  } catch (error) {
    console.error('Delete grade error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error deleting grade',
    });
  }
});

export default router; 