// app.js or server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();


// Import routes
const routes = require('./routes/index');

// Initialize express
const app = express();

mongoose.connect(process.env.MONGO_URI, {})
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.log('MongoDB connection error:', error));



// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

// Server configuration
const PORT = 5000;

// Start server
app.listen(PORT, () => {
    console.log(`Hospital Management System API running on port ${PORT}`);
});

module.exports = app;