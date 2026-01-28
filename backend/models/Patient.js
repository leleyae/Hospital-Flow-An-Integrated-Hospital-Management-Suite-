// models/Patient.js
const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    patientId: {
        type: String,
        unique: true,
        required: true
    },
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
    },
    height: {
        type: Number, // in cm
    },
    weight: {
        type: Number, // in kg
    },
    emergencyContact: {
        name: String,
        relationship: String,
        phoneNumber: String
    },
    primaryCarePhysician: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    },
    insuranceProvider: {
        company: String,
        policyNumber: String,
        groupNumber: String,
        coverageDetails: String
    },
    medicalConditions: [{
        condition: String,
        diagnosedDate: Date,
        status: String,
        notes: String
    }],
    allergies: [{
        allergen: String,
        reaction: String,
        severity: String
    }],
    familyHistory: [{
        relation: String,
        condition: String,
        notes: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Patient', patientSchema);