
const mongoose = require('mongoose');

const testParameterSchema = new mongoose.Schema({
    parameter: {
        type: String,
        required: true,
        trim: true
    },
    value: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        trim: true
    },
    normalRange: {
        type: String,
        trim: true
    },
    notes: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { _id: true });

const qualityControlSchema = new mongoose.Schema({
    qcType: {
        type: String,
        required: true,
        enum: ['internal', 'external', 'proficiency']
    },
    qcValue: {
        type: String,
        required: true
    },
    expectedValue: {
        type: String,
        required: true
    },
    qcStatus: {
        type: String,
        required: true,
        enum: ['pass', 'fail', 'pending']
    },
    notes: {
        type: String,
        trim: true
    },
    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    performedAt: {
        type: Date,
        default: Date.now
    }
}, { _id: true });

const labTestSchema = new mongoose.Schema({
    testId: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    },
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    },
    labTechnicianIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    testName: {
        type: String,
        required: true,
        trim: true
    },
    testType: {
        type: String,
        required: true,
        enum: ['blood', 'urine', 'stool', 'tissue', 'culture', 'imaging', 'molecular', 'other'],
        default: 'blood'
    },
    priority: {
        type: String,
        enum: ['routine', 'urgent', 'stat'],
        default: 'routine'
    },
    status: {
        type: String,
        enum: ['requested', 'sample_collected', 'in_progress', 'completed', 'cancelled'],
        default: 'requested'
    },
    specimenType: {
        type: String,
        trim: true
    },
    specimenDetails: {
        type: String,
        trim: true
    },
    testParameters: [testParameterSchema],
    requestedDate: {
        type: Date,
        default: Date.now
    },
    collectionDate: {
        type: Date
    },
    collectedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    resultDate: {
        type: Date
    },
    resultNotes: {
        type: String,
        trim: true
    },
    notes: {
        type: String,
        trim: true
    },
    equipmentUsed: {
        type: String,
        trim: true
    },
    equipmentId: {
        type: String,
        trim: true
    },
    equipmentCalibrationDate: {
        type: Date
    },
    qualityControl: [qualityControlSchema],
    validationStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected']
    },
    validationNotes: {
        type: String,
        trim: true
    },
    validatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    validationDate: {
        type: Date
    },
    cancellationReason: {
        type: String,
        trim: true
    },
    cancellationDate: {
        type: Date
    },
    attachment: {
        type: String, // URL or path to uploaded file
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Pre-save middleware to update updatedAt
labTestSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
});

const LabTest = mongoose.model('LabTest', labTestSchema);

module.exports = LabTest;
