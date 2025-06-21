
const express = require('express');
const { 
    getAdminDashboardPage, 
    getAllUsers, 
    getUserById,
    verifyUser
} = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/authMiddleware'); // isAdmin combines protect and role check

const router = express.Router();

// Route to serve the Admin Dashboard HTML page
// This should be mapped to /admin in server.js for a clean URL like yourdomain.com/admin
router.get('/dashboard', protect, isAdmin, getAdminDashboardPage); // if /admin/dashboard
// If server.js maps /admin to this router, then router.get('/', ...) would serve dashboard.html for /admin

// API routes for admin actions (prefixed with /api/admin in server.js)
router.get('/users', protect, isAdmin, getAllUsers);
router.get('/users/:id', protect, isAdmin, getUserById);
router.put('/users/:id/verify', protect, isAdmin, verifyUser);

// Add more admin API routes:
// PUT /users/:id/reject
// GET /providers, POST /providers, PUT /providers/:id, DELETE /providers/:id
// GET /settings, PUT /settings
// POST /announcements
// GET /audit-logs

module.exports = router;
