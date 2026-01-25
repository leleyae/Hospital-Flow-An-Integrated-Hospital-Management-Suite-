// models/Appointment.js
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    appointmentId: {
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
    appointmentDate: {
        type: Date,
        default: Date.now
    },
    startTime: {
        type: String,
        default: Date.now
    },
    endTime: {
        type: String,
        default: Date.now
    },
    appointmentStatus: {
        type: String,
        enum: ['doctor', 'labtesting', 'checkup', 'telemedicine', 'emergency', 'none', 'pending', 'completed'],
        default: 'checkup'
    },
    labTests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LabTest'
    }],

    reason: {
        type: String
    },
    symptoms: [String],
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'emergency'],
        default: 'medium'
    },
    triageNotes: {
        vitalSigns: {
            bloodPressure: String,
            heartRate: Number,
            temperature: Number,
            respiratoryRate: Number,
            oxygenSaturation: Number
        },
        painLevel: {
            type: Number,
            min: 0,
            max: 10
        },
        triageTag: {
            type: String,
            enum: ['RED', 'YELLOW', 'GREEN']
        }
    },
    consultationNotes: String,
    prescriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prescription'
    },
    followUpDate: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Appointment', appointmentSchema);