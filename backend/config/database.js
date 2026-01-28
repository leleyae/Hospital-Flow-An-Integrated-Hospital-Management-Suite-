// config/database.js
const mongoose = require('mongoose');

// Establishes a connection to the MongoDB database

const connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};


module.exports = connectDB;
