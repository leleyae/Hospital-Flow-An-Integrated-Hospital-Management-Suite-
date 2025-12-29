// models/Billing.js
const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
    invoiceId: {
        type: String,
        unique: true,
        required: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    },
    invoiceDate: {
        type: Date,
        default: Date.now
    },
    dueDate: Date,
    items: [{
        description: String,
        quantity: Number,
        unitPrice: Number,
        total: Number,
        type: {
            type: String,
            enum: ['consultation', 'procedure', 'medication', 'lab_test', 'room_charge', 'other']
        }
    }],
    subtotal: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true
    },
    amountPaid: {
        type: Number,
        default: 0
    },
    balance: {
        type: Number,
        default: 0
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'credit_card', 'debit_card', 'insurance', 'online', 'cheque']
    },
    insuranceClaim: {
        insuranceProvider: String,
        policyNumber: String,
        claimAmount: Number,
        claimStatus: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'processed']
        }
    },
    status: {
        type: String,
        enum: ['draft', 'sent', 'paid', 'partial', 'overdue', 'cancelled'],
        default: 'draft'
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

module.exports = mongoose.model('Billing', billingSchema);