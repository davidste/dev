
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AddressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  zip: String,
  country: String,
}, { _id: false });

const ProfileSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  businessName: String,
  businessType: String,
  yearsExperience: Number,
  serviceArea: String,
  specialties: [String],
  photoUrl: String,
  phoneNumber: String,
  address: AddressSchema,
}, { _id: false });

const VerificationSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["unsubmitted", "pending", "verified", "rejected", "suspended"],
    default: "unsubmitted",
  },
  submittedAt: Date,
  reviewedAt: Date,
  reviewedBy: String, // User ID of admin
  rejectionReason: String,
  documents: [String], // Array of document IDs or URLs
  notes: String,
}, { _id: false });

const WalletSchema = new mongoose.Schema({
  balance: { type: Number, default: 0 }, // Default from constants PDF (e.g. 100) or 0? For now 0, init on register
  currency: { type: String, default: "USD" },
}, { _id: false });

const NotificationSettingsOptionsSchema = new mongoose.Schema({
    enabled: { type: Boolean, default: true },
    vinResults: { type: Boolean, default: true },
    promotions: { type: Boolean, default: true },
    systemUpdates: { type: Boolean, default: true },
}, { _id: false });

const NotificationSettingsSchema = new mongoose.Schema({
    push: NotificationSettingsOptionsSchema,
    email: NotificationSettingsOptionsSchema,
}, { _id: false });


const SettingsSchema = new mongoose.Schema({
  notifications: NotificationSettingsSchema,
  language: { type: String, default: "en" },
  timezone: { type: String, default: "UTC" },
}, { _id: false });

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6, // Consider requirements from PDF (8+ chars, upper, lower, num)
    select: false // Don't return password by default
  },
  phone: String, // Add validation if becomes primary login
  authMethod: {
    type: String,
    enum: ["google", "email", "phone"],
    default: "email",
  },
  profile: ProfileSchema,
  verification: VerificationSchema,
  wallet: WalletSchema,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  settings: SettingsSchema,
  fcmToken: String,
  lastLogin: Date,
  isActive: { type: Boolean, default: true },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Initialize nested objects if they don't exist
UserSchema.pre('save', function(next) {
    if (this.isNew) {
        this.profile = this.profile || {};
        this.verification = this.verification || { status: 'unsubmitted' };
        this.wallet = this.wallet || { balance: 100.00, currency: 'USD' }; // Default balance from PDF constants.
        this.settings = this.settings || {
            notifications: {
                push: { enabled: true, vinResults: true, promotions: true, systemUpdates: true },
                email: { enabled: true, vinResults: true, promotions: true, systemUpdates: true }
            },
            language: 'en',
            timezone: 'UTC'
        };
    }
    next();
});


module.exports = mongoose.model('User', UserSchema);
