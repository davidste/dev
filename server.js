
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Route files
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const vinRoutes = require('./routes/vinRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Connect to Database
connectDB();

const app = express();

// CORS Configuration
const corsOptions = {
  origin: process.env.KING_CODES_FRONTEND_URL || '*', // Be more specific in production
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true // if you need to send cookies
};
app.use(cors(corsOptions));

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files for admin UI
app.use('/admin-ui', express.static(path.join(__dirname, 'admin-ui')));


// Mount Routers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vin', vinRoutes);
app.use('/api/admin', adminRoutes); // For API-based admin actions
app.use('/admin', adminRoutes); // For serving admin HTML page, distinct path


app.get('/', (req, res) => {
  res.send('King Codes API Running');
});

// Basic Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
