// models/Prescription.js
const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
    prescriptionId: {
        type: String,
        unique: true,
        required: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    },
    date: {
        type: Date,
        default: Date.now
    },
    medications: [{
        medicineName: { type: String, required: true },
        genericName: String,
        dosage: { type: String, required: true },
        frequency: { type: String, required: true },
        duration: { type: String, required: true },
        quantity: { type: Number, required: true },
        instructions: String,
        refills: { type: Number, default: 0 },
        isDispensed: { type: Boolean, default: false },
        // New fields for pharmacy
        medicineId: { type: String, ref: 'PharmacyInventory' },
        unitPrice: Number,
        totalPrice: Number,
        dispensedQuantity: { type: Number, default: 0 },
        dispensedAt: Date,
        dispensedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }],

    // Add these fields to the main schema
    dispensed: {
        type: Boolean,
        default: false
    },
    dispensedAt: Date,
    dispensedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    totalAmount: Number,
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'partially_paid', 'cancelled'],
        default: 'pending'
    },
    paymentMethod: String,
    transactionId: String,
    diagnosis: [String],
    notes: String,
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled', 'expired'],
        default: 'active'
    },
    validUntil: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Prescription', prescriptionSchema);