// models/Doctor.js
const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    doctorId: {
        type: String,
        unique: true,
        required: true
    },
    specialization: {
        type: String,
        required: true
    },
    qualifications: [{
        degree: String,
        university: String,
        year: Number
    }],
    licenseNumber: {
        type: String,
        required: true,
        unique: true
    },
    department: {
        type: String,
        required: true
    },
    consultationFee: {
        type: Number,
        required: true
    },
    availability: [{
        dayOfWeek: {
            type: Number,
            min: 0,
            max: 6 // 0 = Sunday, 6 = Saturday
        },
        startTime: String, // Format: "HH:MM"
        endTime: String,
        isAvailable: Boolean
    }],
    maxPatientsPerDay: {
        type: Number,
        default: 30
    },
    signature: {
        type: String // URL to signature image
    },
    notes: String
});

module.exports = mongoose.model('Doctor', doctorSchema);