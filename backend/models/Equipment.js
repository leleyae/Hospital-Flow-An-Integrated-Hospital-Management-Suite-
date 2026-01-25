// models/Equipment.js
const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
    equipmentId: {
        type: String,
        unique: true,
        required: true
    },
    equipmentName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['diagnostic', 'therapeutic', 'monitoring', 'surgical', 'laboratory', 'other']
    },
    manufacturer: String,
    model: String,
    serialNumber: String,
    department: String,
    purchaseDate: Date,
    warrantyExpiry: Date,
    status: {
        type: String,
        enum: ['active', 'maintenance', 'out_of_service', 'retired']
    },
    lastMaintenanceDate: Date,
    nextMaintenanceDate: Date,

    currentLocation: String,
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Equipment', equipmentSchema);