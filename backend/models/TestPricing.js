// models/LabTestPrice.js
const mongoose = require('mongoose');

const labTestPriceSchema = new mongoose.Schema({
    testName: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    testCode: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
        unique: true
    },
    testType: {
        type: String,
        required: true,
        enum: ['blood', 'urine', 'stool', 'tissue', 'culture', 'imaging', 'molecular', 'other'],
        default: 'blood'
    },
    category: {
        type: String,
        enum: ['hematology', 'biochemistry', 'microbiology', 'serology', 'radiology', 'pathology', 'genetic', 'other'],
        default: 'hematology'
    },
    basePrice: {
        type: Number,
        required: true,
        min: 0
    },
    urgentPrice: {
        type: Number,
        min: 0
    },
    statPrice: {
        type: Number,
        min: 0
    },
    description: {
        type: String,
        trim: true
    },
    estimatedTime: {
        type: String // e.g., "2-3 hours", "24 hours", "48-72 hours"
    },
    isActive: {
        type: Boolean,
        default: true
    },
    requiresFasting: {
        type: Boolean,
        default: false
    },
    specialInstructions: {
        type: String,
        trim: true
    },
    parametersIncluded: [{
        type: String,
        trim: true
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

// Pre-save middleware to update updatedAt
labTestPriceSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('LabTestPrice', labTestPriceSchema);