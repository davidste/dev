
const VinRequest = require('../models/VinRequest');
const User = require('../models/User'); // To deduct balance

const MOCK_LOOKUP_COST_BACKEND = 5.00; // Consistent with frontend

// @desc    Perform VIN Lookup
// @route   POST /api/vin/lookup
// @access  Private
exports.performVinLookup = async (req, res, next) => {
  const { vin, make, model, year } = req.body;
  const userId = req.user.id; // from protect middleware

  if (!vin || vin.length !== 17) {
    return res.status(400).json({ success: false, error: 'Valid 17-character VIN is required' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (user.wallet.balance < MOCK_LOOKUP_COST_BACKEND) {
        return res.status(402).json({ success: false, error: 'Insufficient balance for VIN lookup.' });
    }

    // TODO: Implement actual VIN lookup logic with external providers
    // This is a placeholder for the logic flow described in PDF (p.3 Lookup Flow)
    // 1. VIN Input: (received)
    // 2. Validation: (basic done, add checksum if possible)
    // 3. Provider Selection: (mock for now)
    // 4. API Request: (mock)
    // 5. Fallback Logic: (mock)
    // 6. Result Processing: (mock)
    // 7. Cost Calculation: (done with MOCK_LOOKUP_COST_BACKEND)
    // 8. Balance Deduction: (done)

    // Mock API response from a provider
    const mockProviderResponse = {
      vehicleDescription: `Illustrative description for ${year || ''} ${make || ''} ${model || ''} with VIN ${vin.substring(0, 8)}...`,
      illustrativeKeyTypes: ["Transponder Key", "Remote Head Key"],
      illustrativePinFormat: "Typically 4-8 digits, varies by system.",
      importantNotice: "IMPORTANT: This is illustrative data from King Codes backend. Not for real use."
    };
    
    // Deduct balance (atomic operation ideally)
    user.wallet.balance -= MOCK_LOOKUP_COST_BACKEND;
    await user.save();

    const vinRequestEntry = await VinRequest.create({
      user: userId,
      vin: vin,
      vinData: { vin, make, model, year: parseInt(year) }, // Parse year if provided
      // provider: { name: "MockProvider", responseTime: 50 }, // Example
      // result: mockProviderResponse, // Map this correctly
      cost: MOCK_LOOKUP_COST_BACKEND,
      status: 'success',
      // metadata: { ipAddress: req.ip, userAgent: req.headers['user-agent'] } // Example
    });
    
    // Return the illustrative data, similar to frontend Gemini service
    res.status(200).json({ success: true, data: mockProviderResponse, newBalance: user.wallet.balance });

  } catch (error) {
    console.error('VIN Lookup error:', error.message);
    res.status(500).json({ success: false, error: 'Server Error during VIN lookup' });
  }
};

// @desc    Get VIN Lookup History for current user
// @route   GET /api/vin/history
// @access  Private
exports.getLookupHistory = async (req, res, next) => {
    try {
        const history = await VinRequest.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(50);
        res.status(200).json({ success: true, count: history.length, data: history });
    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({ success: false, error: 'Server Error fetching history' });
    }
};

// Add other VIN related controllers (validate, statistics etc.)
