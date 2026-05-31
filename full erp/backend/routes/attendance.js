import express from 'express';
import { body, validationResult } from 'express-validator';
import { supabase } from '../config/supabase.js';
import { protect, admin, teacher } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get user's attendance
// @route   GET /api/attendance/my
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const { data: attendance, error } = await supabase
      .from('attendance')
      .select(`
        *,
        courses (*)
      `)
      .eq('student_id', req.user.id)
      .order('date', { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Error fetching attendance',
      });
    }

    res.json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching attendance',
    });
  }
});

// @desc    Get all attendance (admin/teacher only)
// @route   GET /api/attendance
// @access  Private/Admin/Teacher
router.get('/', protect, async (req, res) => {
  try {
    const { data: attendance, error } = await supabase
      .from('attendance')
      .select(`
        *,
        profiles (*),
        courses (*)
      `)
      .order('date', { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Error fetching attendance',
      });
    }

    res.json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    console.error('Get all attendance error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching attendance',
    });
  }
});

// @desc    Mark attendance (admin/teacher only)
// @route   POST /api/attendance
// @access  Private/Admin/Teacher
router.post('/', [
  protect,
  body('student_id').isUUID(),
  body('course_id').isUUID(),
  body('date').isISO8601(),
  body('status').isIn(['present', 'absent', 'late', 'excused']),
  body('notes').optional().trim(),
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

    const { data: attendance, error } = await supabase
      .from('attendance')
      .insert([req.body])
      .select(`
        *,
        profiles (*),
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
      message: 'Attendance marked successfully',
      data: attendance,
    });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error marking attendance',
    });
  }
});

// @desc    Update attendance (admin/teacher only)
// @route   PUT /api/attendance/:id
// @access  Private/Admin/Teacher
router.put('/:id', [
  protect,
  body('status').isIn(['present', 'absent', 'late', 'excused']),
  body('notes').optional().trim(),
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

    const { data: attendance, error } = await supabase
      .from('attendance')
      .update(req.body)
      .eq('id', req.params.id)
      .select(`
        *,
        profiles (*),
        courses (*)
      `)
      .single();

    if (error || !attendance) {
      return res.status(404).json({
        success: false,
        error: 'Attendance record not found',
      });
    }

    res.json({
      success: true,
      message: 'Attendance updated successfully',
      data: attendance,
    });
  } catch (error) {
    console.error('Update attendance error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error updating attendance',
    });
  }
});

// @desc    Get attendance summary
// @route   GET /api/attendance/summary
// @access  Private
router.get('/summary', protect, async (req, res) => {
  try {
    const { data: attendance, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('student_id', req.user.id);

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Error fetching attendance summary',
      });
    }

    const total = attendance.length;
    const present = attendance.filter(a => a.status === 'present').length;
    const absent = attendance.filter(a => a.status === 'absent').length;
    const late = attendance.filter(a => a.status === 'late').length;
    const excused = attendance.filter(a => a.status === 'excused').length;
    const percentage = total > 0 ? ((present + late) / total) * 100 : 0;

    res.json({
      success: true,
      data: {
        total,
        present,
        absent,
        late,
        excused,
        percentage: Math.round(percentage * 100) / 100,
      },
    });
  } catch (error) {
    console.error('Get attendance summary error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching attendance summary',
    });
  }
});

export default router; 