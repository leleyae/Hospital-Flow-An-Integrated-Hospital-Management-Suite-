const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const {
    User,
    Patient,
    Doctor,
    Appointment,
    MedicalRecord,
    Prescription,
    LabTest,
    Billing,
    PharmacyInventory,
    Department,
    LabTestPrice
} = require('./models/index');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/hospitalDB');

const createDemoPatient = async () => {
    try {
        console.log('Creating demo patient with complete medical data...');

        // 1. Create User for Patient
        const patientUser = new User({
            username: 'john.doe',
            email: 'john.doe@example.com',
            password: 'Password123',
            role: 'patient',
            firstName: 'John',
            lastName: 'Doe',
            phoneNumber: '+1 234-567-8900',
            dateOfBirth: new Date('1985-05-15'),
            address: {
                street: '123 Main St',
                city: 'New York',
                state: 'NY',
                zipCode: '10001',
                country: 'USA'
            },
            profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg'
        });
        await patientUser.save();
        console.log('✓ Patient user created');

        // 2. Create Doctor (for appointments)
        const doctorUser = new User({
            username: 'dr.smith',
            email: 'dr.smith@hospital.com',
            password: 'Doctor123',
            role: 'doctor',
            firstName: 'Michael',
            lastName: 'Smith',
            phoneNumber: '+1 234-567-8901',
            dateOfBirth: new Date('1975-08-20')
        });
        await doctorUser.save();

        const doctor = new Doctor({
            userId: doctorUser._id,
            doctorId: 'DOC' + Date.now().toString().slice(-6),
            specialization: 'Cardiology',
            licenseNumber: 'LIC' + Date.now().toString().slice(-6),
            department: 'Cardiology',
            consultationFee: 150,
            availability: [
                {
                    dayOfWeek: 1,
                    startTime: "09:00",
                    endTime: "17:00",
                    isAvailable: true
                },
                {
                    dayOfWeek: 2,
                    startTime: "09:00",
                    endTime: "17:00",
                    isAvailable: true
                }
            ]
        });
        await doctor.save();
        console.log('✓ Doctor created');

        // 3. Create Patient Profile
        const patient = new Patient({
            userId: patientUser._id,
            patientId: 'PAT' + Date.now().toString().slice(-6),
            bloodGroup: 'O+',
            height: 180,
            weight: 75,
            emergencyContact: {
                name: 'Jane Doe',
                relationship: 'Spouse',
                phoneNumber: '+1 234-567-8902'
            },
            primaryCarePhysician: doctor._id,
            insuranceProvider: {
                company: 'HealthFirst Insurance',
                policyNumber: 'HF-78901234',
                groupNumber: 'GRP-5678',
                coverageDetails: 'Comprehensive health coverage'
            },
            medicalConditions: [
                {
                    condition: 'Hypertension',
                    diagnosedDate: new Date('2020-03-15'),
                    status: 'Managed',
                    notes: 'Controlled with medication'
                },
                {
                    condition: 'Type 2 Diabetes',
                    diagnosedDate: new Date('2019-07-10'),
                    status: 'Controlled',
                    notes: 'Diet and exercise management'
                }
            ],
            allergies: [
                {
                    allergen: 'Penicillin',
                    reaction: 'Rash',
                    severity: 'High'
                },
                {
                    allergen: 'Peanuts',
                    reaction: 'Anaphylaxis',
                    severity: 'Critical'
                }
            ],
            familyHistory: [
                {
                    relation: 'Father',
                    condition: 'Heart Disease',
                    notes: 'Heart attack at age 60'
                },
                {
                    relation: 'Mother',
                    condition: 'Diabetes',
                    notes: 'Type 2 diabetes'
                }
            ]
        });
        await patient.save();
        console.log('✓ Patient profile created');

        // 4. Create Appointment
        const appointment = new Appointment({
            appointmentId: 'APT' + Date.now().toString().slice(-6),
            patientId: patient._id,
            doctorId: doctor._id,
            appointmentDate: new Date('2024-01-15'),
            startTime: "14:00",
            endTime: "14:30",
            appointmentStatus: 'completed',
            reason: 'Routine checkup and blood pressure concerns',
            symptoms: ['Fatigue', 'Headache', 'Dizziness'],
            priority: 'medium',
            triageNotes: {
                vitalSigns: {
                    bloodPressure: '130/85',
                    heartRate: 72,
                    temperature: 98.6,
                    respiratoryRate: 16,
                    oxygenSaturation: 98
                },
                painLevel: 2,
                triageTag: 'GREEN'
            },
            consultationNotes: 'Patient reports fatigue and occasional dizziness. BP slightly elevated. Recommended blood tests and follow-up.'
        });
        await appointment.save();
        console.log('✓ Appointment created');

        // 5. Create Lab Test
        const labTest = new LabTest({
            testId: 'LAB' + Date.now().toString().slice(-6),
            patientId: patient._id,
            doctorId: doctor._id,
            appointmentId: appointment._id,
            testName: 'Complete Blood Count',
            testType: 'blood',
            priority: 'routine',
            status: 'completed',
            specimenType: 'Blood',
            specimenDetails: 'Venous blood sample',
            testParameters: [
                {
                    parameter: 'Hemoglobin',
                    value: '14.2',
                    unit: 'g/dL',
                    normalRange: '13.5-17.5',
                    notes: 'Within normal range'
                },
                {
                    parameter: 'White Blood Cells',
                    value: '7.5',
                    unit: '10^3/μL',
                    normalRange: '4.5-11.0',
                    notes: 'Normal'
                },
                {
                    parameter: 'Platelets',
                    value: '250',
                    unit: '10^3/μL',
                    normalRange: '150-450',
                    notes: 'Normal'
                }
            ],
            collectionDate: new Date('2024-01-15'),
            resultDate: new Date('2024-01-16'),
            resultNotes: 'All parameters within normal limits',
            validationStatus: 'approved',
            validatedBy: doctorUser._id,
            validationDate: new Date('2024-01-16')
        });
        await labTest.save();
        console.log('✓ Lab test created');

        // 6. Create Prescription
        const prescription = new Prescription({
            prescriptionId: 'RX' + Date.now().toString().slice(-6),
            patientId: patient._id,
            doctorId: doctor._id,
            appointmentId: appointment._id,
            date: new Date('2024-01-15'),
            medications: [
                {
                    medicineName: 'Lisinopril',
                    genericName: 'Lisinopril',
                    dosage: '10mg',
                    frequency: 'Once daily',
                    duration: '30 days',
                    quantity: 30,
                    instructions: 'Take in the morning with food',
                    refills: 2,
                    isDispensed: true,
                    medicineId: 'MED001',
                    unitPrice: 25.50,
                    totalPrice: 765.00,
                    dispensedQuantity: 30,
                    dispensedAt: new Date('2024-01-15'),
                    dispensedBy: doctorUser._id
                },
                {
                    medicineName: 'Metformin',
                    genericName: 'Metformin',
                    dosage: '500mg',
                    frequency: 'Twice daily',
                    duration: '30 days',
                    quantity: 60,
                    instructions: 'Take with meals',
                    refills: 3,
                    isDispensed: true,
                    medicineId: 'MED002',
                    unitPrice: 15.75,
                    totalPrice: 945.00,
                    dispensedQuantity: 60,
                    dispensedAt: new Date('2024-01-15'),
                    dispensedBy: doctorUser._id
                }
            ],
            dispensed: true,
            dispensedAt: new Date('2024-01-15'),
            dispensedBy: doctorUser._id,
            totalAmount: 1710.00,
            paymentStatus: 'paid',
            paymentMethod: 'insurance',
            diagnosis: ['Hypertension', 'Type 2 Diabetes'],
            notes: 'Monitor blood pressure regularly. Follow up in 1 month.',
            status: 'completed',
            validUntil: new Date('2024-04-15')
        });
        await prescription.save();
        console.log('✓ Prescription created');

        // 7. Create Medical Record
        const medicalRecord = new MedicalRecord({
            patientId: patient._id,
            recordType: 'consultation',
            date: new Date('2024-01-15'),
            doctorId: doctor._id,
            department: 'Cardiology',
            chiefComplaint: 'Fatigue and dizziness',
            historyOfPresentIllness: 'Patient reports 2 weeks of increasing fatigue and occasional dizziness, especially when standing quickly.',
            pastMedicalHistory: 'Hypertension diagnosed 2020, Type 2 Diabetes diagnosed 2019',
            examinationFindings: 'BP: 130/85, HR: 72, RR: 16, Temp: 98.6. Heart sounds normal, lungs clear.',
            diagnosis: [
                {
                    code: 'I10',
                    description: 'Essential (primary) hypertension',
                    isPrimary: true
                },
                {
                    code: 'E11.9',
                    description: 'Type 2 diabetes mellitus without complications',
                    isPrimary: false
                }
            ],
            medications: [
                {
                    name: 'Lisinopril',
                    dosage: '10mg daily',
                    duration: '30 days'
                },
                {
                    name: 'Metformin',
                    dosage: '500mg twice daily',
                    duration: '30 days'
                }
            ],
            labResults: [
                {
                    testId: labTest._id,
                    result: 'Normal CBC results',
                    notes: 'All parameters within normal limits'
                }
            ],
            followUpInstructions: 'Return in 1 month for follow-up. Monitor blood pressure daily.',
            nextAppointment: new Date('2024-02-15'),
            attachments: [
                {
                    fileName: 'ecg_report.pdf',
                    fileUrl: '/uploads/ecg_report_12345.pdf',
                    fileType: 'pdf'
                }
            ]
        });
        await medicalRecord.save();
        console.log('✓ Medical record created');

        // 8. Create Billing/Invoice
        const billing = new Billing({
            invoiceId: 'INV' + Date.now().toString().slice(-6),
            patientId: patient._id,
            appointmentId: appointment._id,
            invoiceDate: new Date('2024-01-15'),
            dueDate: new Date('2024-02-15'),
            items: [
                {
                    description: 'Cardiology Consultation',
                    quantity: 1,
                    unitPrice: 150,
                    total: 150,
                    type: 'consultation'
                },
                {
                    description: 'Complete Blood Count Test',
                    quantity: 1,
                    unitPrice: 85,
                    total: 85,
                    type: 'lab_test'
                },
                {
                    description: 'Lisinopril 10mg (30 tablets)',
                    quantity: 1,
                    unitPrice: 25.50,
                    total: 25.50,
                    type: 'medication'
                },
                {
                    description: 'Metformin 500mg (60 tablets)',
                    quantity: 1,
                    unitPrice: 15.75,
                    total: 15.75,
                    type: 'medication'
                }
            ],
            subtotal: 276.25,
            tax: 22.10,
            discount: 0,
            totalAmount: 298.35,
            amountPaid: 298.35,
            balance: 0,
            paymentMethod: 'insurance',
            insuranceClaim: {
                insuranceProvider: 'HealthFirst Insurance',
                policyNumber: 'HF-78901234',
                claimAmount: 298.35,
                claimStatus: 'approved'
            },
            status: 'paid',
            notes: 'Insurance claim processed and approved'
        });
        await billing.save();
        console.log('✓ Billing invoice created');

        // 9. Create Pharmacy Inventory items
        const med1 = new PharmacyInventory({
            medicineId: 'MED001',
            medicineName: 'Lisinopril',
            genericName: 'Lisinopril',
            manufacturer: 'ABC Pharmaceuticals',
            batchNumber: 'BATCH-2023-LIS001',
            expiryDate: new Date('2025-12-31'),
            quantity: 1000,
            unit: 'tablet',
            unitPrice: 0.85,
            category: 'antihypertensive',
            reorderLevel: 100,
            supplier: {
                name: 'Pharma Supply Co.',
                contact: 'supply@pharma.com',
                address: '123 Pharma St, NY'
            },
            storageConditions: 'Store at room temperature'
        });

        const med2 = new PharmacyInventory({
            medicineId: 'MED002',
            medicineName: 'Metformin',
            genericName: 'Metformin',
            manufacturer: 'XYZ Pharma',
            batchNumber: 'BATCH-2023-MET001',
            expiryDate: new Date('2025-11-30'),
            quantity: 1500,
            unit: 'tablet',
            unitPrice: 0.525,
            category: 'diabetic',
            reorderLevel: 150,
            supplier: {
                name: 'Med Supply Inc.',
                contact: 'contact@medsupply.com',
                address: '456 Medical Ave, NY'
            },
            storageConditions: 'Store in a dry place'
        });

        await Promise.all([med1.save(), med2.save()]);
        console.log('✓ Pharmacy inventory created');

        // 10. Create Department
        const department = new Department({
            departmentId: 'DEPT001',
            departmentName: 'Cardiology',
            description: 'Heart and cardiovascular care department',
            totalBeds: 50,
            occupiedBeds: 35,
            beds: [
                {
                    bedNumber: 'CARD-101',
                    roomNumber: '101',
                    bedType: 'private',
                    isOccupied: true,
                    patientId: patient._id,
                    admissionDate: new Date('2024-01-10')
                }
            ],
            contactNumber: '+1 234-567-8001',
            location: 'Floor 3, Wing A'
        });
        await department.save();
        console.log('✓ Department created');

        // 11. Create Lab Test Pricing
        const labTestPrice = new LabTestPrice({
            testName: 'Complete Blood Count',
            testCode: 'CBC',
            testType: 'blood',
            category: 'hematology',
            basePrice: 85,
            urgentPrice: 120,
            statPrice: 150,
            description: 'Complete analysis of blood components',
            estimatedTime: '4-6 hours',
            requiresFasting: false,
            parametersIncluded: ['Hemoglobin', 'WBC', 'RBC', 'Platelets', 'Hematocrit']
        });
        await labTestPrice.save();
        console.log('✓ Lab test pricing created');

        console.log('\n✅ DEMO PATIENT CREATION COMPLETE!');
        console.log('\n====================================');
        console.log('PATIENT DETAILS:');
        console.log('====================================');
        console.log(`Patient ID: ${patient.patientId}`);
        console.log(`Name: ${patientUser.firstName} ${patientUser.lastName}`);
        console.log(`Email: ${patientUser.email}`);
        console.log(`Username: ${patientUser.username}`);
        console.log(`Password: Password123`);
        console.log('\n====================================');
        console.log('DATA CREATED:');
        console.log('====================================');
        console.log('- User Account');
        console.log('- Patient Profile');
        console.log('- Doctor Profile');
        console.log('- Appointment');
        console.log('- Lab Test with Results');
        console.log('- Prescription with Medications');
        console.log('- Medical Record');
        console.log('- Billing Invoice');
        console.log('- Pharmacy Inventory');
        console.log('- Department');
        console.log('- Lab Test Pricing');
        console.log('\nUse the patient login credentials to access the dashboard.');

        // Disconnect from MongoDB
        await mongoose.disconnect();

    } catch (error) {
        console.error('Error creating demo patient:', error);
        process.exit(1);
    }
};

createDemoPatient();