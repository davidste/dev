
const path = require('path');
const User = require('../models/User');

// @desc    Serve Admin Dashboard HTML
// @route   GET /admin/dashboard (or just /admin via server.js mapping)
// @access  Private (Admin only)
exports.getAdminDashboardPage = (req, res) => {
  // This will serve the static HTML file.
  // Ensure the path is correct relative to server.js
  res.sendFile(path.join(__dirname, '..', 'admin-ui', 'dashboard.html'));
};

// @desc    Get all users (example admin action)
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).select('-password'); // Exclude passwords
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error fetching users' });
    }
};

// @desc    Get user by ID (example admin action)
// @route   GET /api/admin/users/:id
// @access  Private (Admin only)
exports.getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Verify a user (example admin action)
// @route   PUT /api/admin/users/:id/verify
// @access  Private (Admin only)
exports.verifyUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        user.verification.status = 'verified';
        user.verification.reviewedAt = Date.now();
        user.verification.reviewedBy = req.user.id; // Admin who verified
        await user.save();
        res.status(200).json({ success: true, message: `User ${user.email} verified.`, data: user.verification });
    } catch (error) {
        console.error('Verify user error:', error);
        res.status(500).json({ success: false, error: 'Server error verifying user.' });
    }
};


// Implement other admin controllers:
// - updateUserByAdmin, deleteUserByAdmin
// - getAdminDashboardData (for API if admin UI is SPA)
// - manageProviders, manageSettings, manageAnnouncements, viewAuditLogs etc.
// based on PDF (p.2-3 API Endpoints, p.16-18 Admin Features)
