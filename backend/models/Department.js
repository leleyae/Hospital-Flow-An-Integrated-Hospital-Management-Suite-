// models/Department.js
const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    departmentId: {
        type: String,
        unique: true,
        required: true
    },
    departmentName: {
        type: String,
        required: true
    },
    departmentHead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    },
    description: String,
    totalBeds: {
        type: Number,
        default: 0
    },
    occupiedBeds: {
        type: Number,
        default: 0
    },
    beds: [{
        bedNumber: {
            type: String,
            required: true
        },
        roomNumber: String,
        bedType: {
            type: String,
            enum: ['general', 'icu', 'emergency', 'private', 'semi_private']
        },
        isOccupied: {
            type: Boolean,
            default: false
        },
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Patient'
        },
        admissionDate: Date
    }],
    contactNumber: String,
    location: String,
    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Department', departmentSchema);