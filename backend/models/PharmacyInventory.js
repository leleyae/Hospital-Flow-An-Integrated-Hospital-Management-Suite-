// models/PharmacyInventory.js
const mongoose = require('mongoose');

const pharmacyInventorySchema = new mongoose.Schema({
    medicineId: {
        type: String,
        unique: true,
        required: true
    },
    medicineName: {
        type: String,
        required: true
    },
    genericName: String,
    manufacturer: String,
    batchNumber: {
        type: String,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    unit: {
        type: String,
        enum: ['tablet', 'capsule', 'ml', 'mg', 'gm', 'injection', 'bottle'],
        required: true
    },
    unitPrice: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: ['antibiotic', 'analgesic', 'antihypertensive', 'diabetic', 'psychiatric', 'other']
    },
    reorderLevel: {
        type: Number,
        default: 10
    },
    supplier: {
        name: String,
        contact: String,
        address: String
    },
    storageConditions: String,
    description: String,
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PharmacyInventory', pharmacyInventorySchema);