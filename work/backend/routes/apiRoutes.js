const express = require('express');
const router = express.Router();

// Middleware Guards
const { authenticateToken, requireAuth, requireAdmin } = require('../middleware/auth');

// Controllers
const { registerUser, loginUser, googleLoginUser, getMe, logoutUser } = require('../controllers/authController');
const { getProducts, getProductById, createProduct, getAiSearch, getAiCompare, getAiBudgetCart } = require('../controllers/productController');
const { getCartMetadata } = require('../controllers/cartController');
const { getWalletStats, getWalletLedger, getAiCashbackOptimizer } = require('../controllers/walletController');
const { getGamificationStats, postSpinWheel } = require('../controllers/gamificationController');
const { createOrder, verifyPayment, getMyOrders } = require('../controllers/orderController');
const { createReview, getReviews, voteHelpful, getAiReviewSummary } = require('../controllers/reviewsController');
const { getAdminStats } = require('../controllers/adminController');

// ==========================================
// 1. AUTHENTICATION ROUTING
// ==========================================
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.post('/auth/google', googleLoginUser);
router.get('/auth/me', authenticateToken, getMe);
router.post('/auth/logout', logoutUser);

// ==========================================
// 2. PRODUCTS & SPEC COMPARISONS ROUTING
// ==========================================
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.post('/products', authenticateToken, requireAdmin, createProduct);
router.post('/products/search/ai', getAiSearch);
router.post('/products/compare/ai', getAiCompare);
router.post('/products/budget/ai', getAiBudgetCart);

// ==========================================
// 3. CART SYSTEM ROUTING
// ==========================================
router.post('/cart/metadata', getCartMetadata);

// ==========================================
// 4. REWARDS WALLET SYSTEM ROUTING
// ==========================================
router.get('/wallet/stats', authenticateToken, requireAuth, getWalletStats);
router.get('/wallet/ledger', authenticateToken, requireAuth, getWalletLedger);
router.post('/wallet/optimizer/ai', authenticateToken, requireAuth, getAiCashbackOptimizer);

// ==========================================
// 5. GAMIFICATION ACHIEVEMENTS & WHEELS ROUTING
// ==========================================
router.get('/gamification/stats', authenticateToken, requireAuth, getGamificationStats);
router.post('/gamification/spin', authenticateToken, requireAuth, postSpinWheel);

// ==========================================
// 6. ORDERING SYSTEM ROUTING
// ==========================================
router.post('/orders', authenticateToken, requireAuth, createOrder);
router.post('/orders/verify', authenticateToken, requireAuth, verifyPayment);
router.get('/orders/my', authenticateToken, requireAuth, getMyOrders);

// ==========================================
// 7. REVIEW SYSTEM & AI PROS/CONS SUMMARIES ROUTING
// ==========================================
router.get('/products/:id/reviews', getReviews);
router.post('/products/:id/reviews', authenticateToken, requireAuth, createReview);
router.post('/products/:id/reviews/summary', getAiReviewSummary);
router.post('/reviews/:id/helpful', authenticateToken, requireAuth, voteHelpful);

// ==========================================
// 8. ADMINISTRATIVE REPORTING ROUTING
// ==========================================
router.get('/admin/stats', authenticateToken, requireAdmin, getAdminStats);

module.exports = router;
