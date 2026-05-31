import express from 'express';
import { body, validationResult } from 'express-validator';
import { supabase } from '../config/supabase.js';
import { protect, admin, teacher } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { data: courses, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Error fetching courses',
      });
    }

    res.json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching courses',
    });
  }
});

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const { data: course, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found',
      });
    }

    res.json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching course',
    });
  }
});

// @desc    Create new course (admin/teacher only)
// @route   POST /api/courses
// @access  Private/Admin/Teacher
router.post('/', [
  protect,
  body('course_code').trim().notEmpty(),
  body('title').trim().notEmpty(),
  body('credits').isInt({ min: 1, max: 6 }),
  body('instructor').optional().trim(),
  body('semester').optional().trim(),
  body('year').optional().isInt({ min: 2020 }),
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

    const { data: course, error } = await supabase
      .from('courses')
      .insert([req.body])
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course,
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error creating course',
    });
  }
});

// @desc    Update course (admin/teacher only)
// @route   PUT /api/courses/:id
// @access  Private/Admin/Teacher
router.put('/:id', [
  protect,
  body('course_code').optional().trim().notEmpty(),
  body('title').optional().trim().notEmpty(),
  body('credits').optional().isInt({ min: 1, max: 6 }),
  body('instructor').optional().trim(),
  body('semester').optional().trim(),
  body('year').optional().isInt({ min: 2020 }),
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

    const { data: course, error } = await supabase
      .from('courses')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found',
      });
    }

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: course,
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error updating course',
    });
  }
});

// @desc    Delete course (admin only)
// @route   DELETE /api/courses/:id
// @access  Private/Admin
router.delete('/:id', protect, async (req, res) => {
  try {
    const { error } = await supabase
      .from('courses')
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
      message: 'Course deleted successfully',
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error deleting course',
    });
  }
});

// @desc    Get enrolled courses for current user
// @route   GET /api/courses/enrolled
// @access  Private
router.get('/enrolled', protect, async (req, res) => {
  try {
    const { data: enrollments, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        courses (*)
      `)
      .eq('student_id', req.user.id)
      .eq('status', 'enrolled');

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Error fetching enrolled courses',
      });
    }

    res.json({
      success: true,
      data: enrollments,
    });
  } catch (error) {
    console.error('Get enrolled courses error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching enrolled courses',
    });
  }
});

// @desc    Get course assignments
// @route   GET /api/courses/:id/assignments
// @access  Private
router.get('/:id/assignments', protect, async (req, res) => {
  try {
    const { data: assignments, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('course_id', req.params.id)
      .order('due_date', { ascending: true });

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Error fetching assignments',
      });
    }

    res.json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching assignments',
    });
  }
});

export default router; 