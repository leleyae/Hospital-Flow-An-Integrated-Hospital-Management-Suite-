// models/index.js
module.exports = {
    User: require('./User'),
    Patient: require('./Patient'),
    Doctor: require('./Doctor'),
    Appointment: require('./Appointment'),
    MedicalRecord: require('./MedicalRecord'),
    Prescription: require('./Prescription'),
    LabTest: require('./LabTest'),
    PharmacyInventory: require('./PharmacyInventory'),
    Billing: require('./Billing'),
    Department: require('./Department'),
    AuditLog: require('./AuditLog'),
    Notification: require('./Notification'),
    LeaveRequest: require('./LeaveRequest'),
    Equipment: require('./Equipment')
};