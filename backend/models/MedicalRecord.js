// models/MedicalRecord.js
const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    recordType: {
        type: String,
        enum: ['consultation', 'diagnosis', 'procedure', 'admission', 'discharge', 'lab_result'],
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    },
    department: String,
    chiefComplaint: String,
    historyOfPresentIllness: String,
    pastMedicalHistory: String,
    examinationFindings: String,
    diagnosis: [{
        code: String,
        description: String,
        isPrimary: Boolean
    }],
    procedures: [{
        name: String,
        date: Date,
        notes: String
    }],
    medications: [{
        name: String,
        dosage: String,
        duration: String
    }],
    labResults: [{
        testId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'LabTest'
        },
        result: String,
        notes: String
    }],
    followUpInstructions: String,
    nextAppointment: Date,
    attachments: [{
        fileName: String,
        fileUrl: String,
        fileType: String
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

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);