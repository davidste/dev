
const mongoose = require('mongoose');

const VinDataSchema = new mongoose.Schema({
  vin: String,
  year: Number,
  make: String,
  model: String,
  engine: String,
  transmission: String,
  drivetrain: String,
  bodyType: String,
  country: String,
}, { _id: false });

const ProviderInfoSchema = new mongoose.Schema({
  id: String, // Provider's own ID
  name: String,
  responseTime: Number, // milliseconds
}, { _id: false });

const RequestDetailsSchema = new mongoose.Schema({
  url: String,
  method: String, // GET|POST
  headers: Object,
  body: Object,
  timestamp: Date,
}, { _id: false });

const ResponseDetailsSchema = new mongoose.Schema({
  status: Number, // HTTP status from provider
  data: Object, // Raw data from provider
  timestamp: Date,
}, { _id: false });

const ResultSchema = new mongoose.Schema({
  keyCode: String,
  pinCode: String,
  transponderType: String,
  remoteType: String,
  additionalInfo: Object,
}, { _id: false });

const DiscountAppliedSchema = new mongoose.Schema({
  plan: String, // Name or ID of discount plan
  percentage: Number,
  amount: Number, // Calculated discount amount
}, { _id: false });

const ErrorDetailsSchema = new mongoose.Schema({
  code: String,
  message: String,
  details: Object,
}, { _id: false });

const MetadataSchema = new mongoose.Schema({
  ipAddress: String,
  userAgent: String,
  appVersion: String,
  platform: String, // ios|android|web
}, { _id: false });


const VinRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  vin: {
    type: String,
    required: true,
    length: 17
  },
  vinData: VinDataSchema,
  provider: ProviderInfoSchema, // Info of the provider used for this request
  request: RequestDetailsSchema, // Details sent to the provider
  response: ResponseDetailsSchema, // Details received from the provider
  result: ResultSchema, // Parsed final result given to user
  cost: { type: Number, required: true },
  discountApplied: DiscountAppliedSchema,
  status: {
    type: String,
    enum: ['pending', 'success', 'failed', 'cancelled'],
    default: 'pending'
  },
  error: ErrorDetailsSchema, // If lookup failed
  metadata: MetadataSchema, // User agent, IP, etc.
  completedAt: Date,
}, {
  timestamps: true // createdAt
});

module.exports = mongoose.model('VinRequest', VinRequestSchema);
