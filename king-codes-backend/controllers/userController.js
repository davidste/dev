
const User = require('../models/User');

// @desc    Get current user's profile
// @route   GET /api/users/profile
// @access  Private (requires token)
exports.getUserProfile = async (req, res, next) => {
  try {
    // req.user is attached by the 'protect' middleware
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Example: Update fields from req.body.profile
    // Sanitize and validate input before updating
    const { firstName, lastName, businessName, phone, address, specialties, serviceArea, businessType, yearsExperience } = req.body.profile || {};
    
    if (firstName) user.profile.firstName = firstName;
    if (lastName) user.profile.lastName = lastName;
    if (businessName) user.profile.businessName = businessName;
    if (phone) user.profile.phoneNumber = phone; // Assuming 'phone' in body maps to 'phoneNumber' in schema
    if (address) user.profile.address = { ...user.profile.address, ...address };
    if (specialties) user.profile.specialties = specialties;
    if (serviceArea) user.profile.serviceArea = serviceArea;
    if (businessType) user.profile.businessType = businessType;
    if (yearsExperience) user.profile.yearsExperience = yearsExperience;
    
    // Similarly for user settings:
    // if (req.body.settings && req.body.settings.notifications) {
    //   user.settings.notifications = {...user.settings.notifications, ...req.body.settings.notifications};
    // }
    // if (req.body.settings && req.body.settings.language) user.settings.language = req.body.settings.language;

    user.updatedAt = Date.now();
    await user.save();
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({ success: false, error: 'Server Error updating profile' });
  }
};

// Add other user management functions as per PDF (upload-photo, verification-status, etc.)
