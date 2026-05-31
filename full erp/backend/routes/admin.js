import express from 'express';
import { body, validationResult } from 'express-validator';
import { supabase } from '../config/supabase.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
router.get('/dashboard', protect, async (req, res) => {
  try {
    // Get total students
    const { count: totalStudents } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // Get total courses
    const { count: totalCourses } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true });

    // Get total enrollments
    const { count: totalEnrollments } = await supabase
      .from('enrollments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'enrolled');

    // Get pending fees
    const { data: pendingFees } = await supabase
      .from('fees')
      .select('*')
      .eq('status', 'pending');

    const totalPendingFees = pendingFees?.length || 0;

    res.json({
      success: true,
      data: {
        totalStudents: totalStudents || 0,
        totalCourses: totalCourses || 0,
        totalEnrollments: totalEnrollments || 0,
        pendingFees: totalPendingFees,
      },
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching admin dashboard',
    });
  }
});

// @desc    Get system statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', protect, async (req, res) => {
  try {
    // Get recent enrollments
    const { data: recentEnrollments } = await supabase
      .from('enrollments')
      .select(`
        *,
        profiles (*),
        courses (*)
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get recent grades
    const { data: recentGrades } = await supabase
      .from('grades')
      .select(`
        *,
        profiles (*),
        courses (*)
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get overdue fees
    const { data: overdueFees } = await supabase
      .from('fees')
      .select(`
        *,
        profiles (*)
      `)
      .neq('status', 'paid')
      .lt('due_date', new Date().toISOString());

    res.json({
      success: true,
      data: {
        recentEnrollments: recentEnrollments || [],
        recentGrades: recentGrades || [],
        overdueFees: overdueFees || [],
      },
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching admin stats',
    });
  }
});

export default router; 