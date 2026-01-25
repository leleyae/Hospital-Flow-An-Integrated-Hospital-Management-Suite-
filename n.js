const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Adjust path if needed

// Connection to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/hospitalDB');
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};
// Users data
const users = [
    {
        username: 'receptionist_user',
        email: 'receptionist@hospital.com',
        password: 'receptionist123',
        role: 'receptionist',
        firstName: 'Test',
        lastName: 'Receptionist',
        phoneNumber: '123-456-7890'
    },
    {
        username: 'pharmacist_user',
        email: 'pharmacist@hospital.com',
        password: 'pharmacist123',
        role: 'pharmacist',
        firstName: 'Test',
        lastName: 'Pharmacist',
        phoneNumber: '123-456-7891'
    },
    {
        username: 'labtech_user',
        email: 'labtech@hospital.com',
        password: 'labtech123',
        role: 'lab_technician',
        firstName: 'Test',
        lastName: 'Lab Tech',
        phoneNumber: '123-456-7892'
    },
    {
        username: 'nurse_user',
        email: 'nurse@hospital.com',
        password: 'nurse123',
        role: 'nurse',
        firstName: 'Test',
        lastName: 'Nurse',
        phoneNumber: '123-456-7893'
    }
];
