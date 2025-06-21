
const express = require('express');
const { performVinLookup, getLookupHistory } = require('../controllers/vinController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes here are protected
router.use(protect);

router.post('/lookup', performVinLookup);
router.get('/history', getLookupHistory);

// Add routes for /validate, /statistics, /history/:id

module.exports = router;
