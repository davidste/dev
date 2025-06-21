
const User = require('../models/User');
const jwt = require('jsonwebtoken'); // Corrected: was 'jsonwebtoken'

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { // Use the required module
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  const { email, password, firstName, lastName, businessName, phone } = req.body;

  try {
    // Basic validation
    if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Please provide email and password' });
    }
    // As per PDF, password requirements: 8+ chars, upper, lower, numbers
    // Add more robust password validation here later.

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }
    
    const user = await User.create({
      email,
      password, // Password will be hashed by Mongoose pre-save hook
      profile: { firstName, lastName, businessName },
      phone,
      wallet: { balance: 100.00, currency: 'USD' } // Initial balance as per PDF idea
    });

    const token = generateToken(user._id);
    res.status(201).json({ success: true, token, userId: user._id, email: user.email, role: user.role });

  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ success: false, error: error.message || 'Server Error during registration' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Please provide email and password' });
  }

  try {
    const user = await User.findOne({ email }).select('+password'); // Explicitly request password

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials (user not found)' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials (password mismatch)' });
    }
    
    user.lastLogin = Date.now();
    await user.save();

    const token = generateToken(user._id);
    res.status(200).json({ success: true, token, userId: user._id, email: user.email, role: user.role });

  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ success: false, error: 'Server Error during login' });
  }
};

// @desc    Get current logged in user (example, useful for token validation)
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  // req.user is set by the 'protect' middleware
  if (!req.user) {
     return res.status(404).json({ success: false, error: 'User not found or token issue' });
  }
  // You might want to fetch the freshest user data, or return req.user if it's sufficient
  const user = await User.findById(req.user.id);
   if (!user) {
     return res.status(404).json({ success: false, error: 'User not found' });
  }
  res.status(200).json({ success: true, data: user });
};