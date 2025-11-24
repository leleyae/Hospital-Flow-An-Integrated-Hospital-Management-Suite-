import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../config/api';
import {
    CalendarIcon,
    ClockIcon,
    UserIcon,
    BeakerIcon,
    PencilIcon,
    ArrowLeftIcon,
    XMarkIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    UserCircleIcon,
    ClipboardDocumentListIcon,
    DocumentCheckIcon,
    TrashIcon,
    PlusIcon
} from '@heroicons/react/24/outline';

const DoctorAppointmentDetails = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('consultation');
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showLabModal, setShowLabModal] = useState(false);
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [labTechnicians, setLabTechnicians] = useState([]);
    const [selectedTechnicians, setSelectedTechnicians] = useState([]);


    // Add to your existing state declarations
    const [consultationNotes, setConsultationNotes] = useState('');

    const [labTestForm, setLabTestForm] = useState({
        tests: [{
            testName: '',
            testType: 'blood',
            priority: 'routine',
            specimenType: '',
            specimenDetails: '',
            notes: '',
            labTechnicianIds: []  // Ensure it's initialized as empty array
        }]
    });
    const [prescriptionForm, setPrescriptionForm] = useState({
        medications: [{ medicineName: '', dosage: '', frequency: '', duration: '', quantity: 1 }],
        diagnosis: [''],
        notes: '',
        validUntil: ''
    });

    const [statusForm, setStatusForm] = useState({
        status: 'pending',
        consultationNotes: '',
        followUpDate: ''
    });


    useEffect(() => {
        fetchAppointmentDetails();
        fetchLabTechnicians(); // Add this
    }, [appointmentId]);

    const fetchLabTechnicians = async () => {
        try {
            const response = await api.get('/doctor/lab-technicians');
            setLabTechnicians(response.data.data);
        } catch (err) {
            console.error('Failed to fetch technicians:', err);
        }
    };
    const fetchAppointmentDetails = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/doctor/appointments/${appointmentId}`);
            setAppointment(response.data.data);
            setConsultationNotes(response.data.data.consultationNotes || ''); // Add this line
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch appointment details');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveConsultationNotes = async () => {
        try {
            await api.put(`/doctor/appointments/${appointmentId}/consultation-notes`, {
                consultationNotes: consultationNotes
            });
            setSuccess('Consultation notes saved successfully');
            fetchAppointmentDetails(); // Refresh data
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save consultation notes');
        }
    };

    const handleUpdateStatus = async () => {
        try {
            await api.put(`/doctor/appointments/${appointmentId}/status`, statusForm);
            setSuccess('Appointment status updated successfully');
            setShowStatusModal(false);
            fetchAppointmentDetails();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update status');
        }
    };

    const handleCreateLabTest = async () => {
        try {
            // Filter out empty tests
            const validTests = labTestForm.tests.filter(test =>
                test.testName.trim() !== ''
            );

            if (validTests.length === 0) {
                setError('Please add at least one test');
                return;
            }

            // Remove labTechnicianIds from payload if it's at root level
            const payload = {
                tests: validTests
                // Remove this: labTechnicianIds: labTestForm.labTechnicianIds
            };

            await api.post(`/doctor/appointments/${appointmentId}/labtest`, payload);
            setSuccess(`${validTests.length} lab test${validTests.length > 1 ? 's' : ''} created successfully`);
            setShowLabModal(false);
            setLabTestForm({
                tests: [{
                    testName: '',
                    testType: 'blood',
                    priority: 'routine',
                    specimenType: '',
                    specimenDetails: '',
                    notes: '',
                    labTechnicianIds: []  // Add this
                }]
            });
            fetchAppointmentDetails();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create lab test');
        }
    };

    const handleCreatePrescription = async () => {
        try {
            await api.post(`/doctor/appointments/${appointmentId}/prescription`, prescriptionForm);
            setSuccess('Prescription created successfully');
            setShowPrescriptionModal(false);
            fetchAppointmentDetails();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create prescription');
        }
    };

    const handleAddMedication = () => {
        setPrescriptionForm({
            ...prescriptionForm,
            medications: [...prescriptionForm.medications, {
                medicineName: '',
                dosage: '',
                frequency: '',
                duration: '',
                quantity: 1
            }]
        });
    };

    const handleMedicationChange = (index, field, value) => {
        const updatedMedications = [...prescriptionForm.medications];
        updatedMedications[index][field] = value;
        setPrescriptionForm({ ...prescriptionForm, medications: updatedMedications });
    };

    // New functions for handling multiple lab tests
    const handleAddTest = () => {
        setLabTestForm({
            ...labTestForm,
            tests: [...labTestForm.tests, {
                testName: '',
                testType: 'blood',
                priority: 'routine',
                specimenType: '',
                specimenDetails: '',
                notes: '',
                labTechnicianIds: []  // Add this
            }]
        });
    };
    const handleRemoveTest = (index) => {
        if (labTestForm.tests.length === 1) {
            // Don't remove the last test, just clear it
            const updatedTests = [...labTestForm.tests];
            updatedTests[0] = {
                testName: '',
                testType: 'blood',
                priority: 'routine',
                specimenType: '',
                specimenDetails: '',
                notes: '',
                labTechnicianIds: []  // Add this
            };
            setLabTestForm({ ...labTestForm, tests: updatedTests });
        } else {
            const updatedTests = labTestForm.tests.filter((_, i) => i !== index);
            setLabTestForm({ ...labTestForm, tests: updatedTests });
        }
    };
    const handleTestChange = (index, field, value) => {
        const updatedTests = [...labTestForm.tests];
        updatedTests[index][field] = value;
        setLabTestForm({ ...labTestForm, tests: updatedTests });
    };

    const getTestStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'in_progress': return 'bg-blue-100 text-blue-800';
            case 'sample_collected': return 'bg-purple-100 text-purple-800';
            case 'requested': return 'bg-yellow-100 text-yellow-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'stat': return 'bg-red-100 text-red-800';
            case 'urgent': return 'bg-orange-100 text-orange-800';
            case 'routine': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-4 text-gray-600">Loading appointment details...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">Error</h3>
                <p className="mt-2 text-sm text-gray-500 text-center">{error}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Go Back
                </button>
            </div>
        </div>
    );

    if (!appointment) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <InformationCircleIcon className="h-12 w-12 text-yellow-500 mx-auto" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">Appointment Not Found</h3>
                <p className="mt-2 text-sm text-gray-500">The requested appointment could not be found.</p>
            </div>
        </div>
    );

    const patient = appointment.patientId;
    const doctor = appointment.doctorId;
    const labTests = appointment.labTests || [];

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            case 'in-progress': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            {/* Header */}
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 mb-4"
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-1" />
                        Back
                    </button>

                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Appointment Details</h1>
                            <p className="text-gray-600 mt-1">ID: {appointment.appointmentId}</p>
                        </div>

                        <div className="flex items-center space-x-4 mt-4 md:mt-0">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.appointmentStatus)}`}>
                                {appointment.appointmentStatus.toUpperCase()}
                            </span>
                            <button
                                onClick={() => setShowStatusModal(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <PencilIcon className="h-4 w-4 mr-2" />
                                Update Status
                            </button>
                        </div>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Patient Card */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                <UserIcon className="h-5 w-5 mr-2 text-blue-500" />
                                Patient Information
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <div className="flex-shrink-0">
                                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                        <span className="text-blue-600 font-semibold text-lg">
                                            {patient?.userId?.firstName?.charAt(0)}
                                        </span>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-sm font-medium text-gray-900">
                                        {patient?.userId?.firstName} {patient?.userId?.lastName}
                                    </h4>
                                    <p className="text-sm text-gray-500">ID: {patient?.patientId}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center text-sm text-gray-600">
                                    <svg className="h-4 w-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                    {patient?.userId?.email}
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <svg className="h-4 w-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                    </svg>
                                    {patient?.userId?.phoneNumber}
                                </div>

                                {patient?.medicalHistory && (
                                    <div className="pt-3 border-t border-gray-100">
                                        <p className="text-sm font-medium text-gray-700 mb-1">Medical History</p>
                                        <p className="text-sm text-gray-600">{patient.medicalHistory}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Appointment Card */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                <CalendarIcon className="h-5 w-5 mr-2 text-green-500" />
                                Appointment Details
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-center text-sm">
                                    <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
                                    <span className="text-gray-700">
                                        {new Date(appointment.appointmentDate).toLocaleDateString()} • {appointment.startTime} - {appointment.endTime}
                                    </span>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-1">Reason</p>
                                    <p className="text-sm text-gray-600">{appointment.reason || 'Not specified'}</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">Priority</span>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(appointment.priority)}`}>
                                        {appointment.priority.toUpperCase()}
                                    </span>
                                </div>

                                {appointment.symptoms && appointment.symptoms.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-2">Symptoms</p>
                                        <div className="flex flex-wrap gap-1">
                                            {appointment.symptoms.map((symptom, index) => (
                                                <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                    {symptom}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Doctor Card */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                <UserCircleIcon className="h-5 w-5 mr-2 text-indigo-500" />
                                Doctor Information
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-1">Doctor</p>
                                    <p className="text-sm text-gray-900 font-medium">
                                        Dr. {doctor?.userId?.firstName} {doctor?.userId?.lastName}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500">Specialization</p>
                                        <p className="text-sm text-gray-900">{doctor?.specialization}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Department</p>
                                        <p className="text-sm text-gray-900">{doctor?.department}</p>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-gray-100">
                                    <p className="text-sm font-medium text-gray-700 mb-1">Consultation Fee</p>
                                    <p className="text-lg font-bold text-indigo-600">${doctor?.consultationFee}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="bg-white rounded-lg shadow mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            {['consultation', 'triage', 'lab', 'prescription'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors duration-200 ${activeTab === tab
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    {tab === 'consultation' && 'Consultation Notes'}
                                    {tab === 'triage' && 'Triage & Vitals'}
                                    {tab === 'lab' && `Lab Tests (${labTests.length})`}
                                    {tab === 'prescription' && 'Prescription'}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-6">
                        {activeTab === 'consultation' && (
                            <div>
                                <h4 className="text-lg font-medium text-gray-900 mb-4">Consultation Notes</h4>
                                <textarea
                                    className="w-full h-48 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    value={consultationNotes}
                                    onChange={(e) => setConsultationNotes(e.target.value)}
                                    placeholder="Enter consultation notes..."
                                />
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={handleSaveConsultationNotes}
                                        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Save Notes
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Triage Tab */}
                        {activeTab === 'triage' && (
                            <div>
                                <h4 className="text-lg font-medium text-gray-900 mb-4">Triage Information & Vital Signs</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Blood Pressure
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                            placeholder="e.g., 120/80"
                                            value={appointment.triageNotes?.vitalSigns?.bloodPressure || ''}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Heart Rate (BPM)
                                        </label>
                                        <input
                                            type="number"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                            value={appointment.triageNotes?.vitalSigns?.heartRate || ''}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Temperature (°C)
                                        </label>
                                        <input
                                            type="number"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                            value={appointment.triageNotes?.vitalSigns?.temperature || ''}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Oxygen Saturation (%)
                                        </label>
                                        <input
                                            type="number"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                            value={appointment.triageNotes?.vitalSigns?.oxygenSaturation || ''}
                                        />
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end">
                                    <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                        Save Vitals
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Lab Tests Tab */}
                        {activeTab === 'lab' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="text-lg font-medium text-gray-900">Lab Tests ({labTests.length})</h4>
                                    <button
                                        onClick={() => setShowLabModal(true)}
                                        className="inline-flex items-center px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                    >
                                        <PlusIcon className="h-4 w-4 mr-2" />
                                        Request Lab Tests
                                    </button>
                                </div>

                                {labTests.length > 0 ? (
                                    <div className="space-y-4">
                                        {labTests.map((test, index) => (
                                            <div key={test._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-purple-300 transition-colors duration-200">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center">
                                                        <BeakerIcon className="h-5 w-5 text-purple-500 mr-2" />
                                                        <h5 className="font-medium text-gray-900">{test.testName}</h5>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(test.priority)}`}>
                                                            {test.priority.toUpperCase()}
                                                        </span>
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTestStatusColor(test.status)}`}>
                                                            {test.status.replace('_', ' ').toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                                    <div>
                                                        <span className="font-medium">Type:</span> {test.testType}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Specimen:</span> {test.specimenType || 'Not specified'}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Requested:</span> {new Date(test.requestedDate).toLocaleDateString()}
                                                    </div>
                                                    {test.collectionDate && (
                                                        <div>
                                                            <span className="font-medium">Collected:</span> {new Date(test.collectionDate).toLocaleDateString()}
                                                        </div>
                                                    )}
                                                    {test.resultDate && (
                                                        <div>
                                                            <span className="font-medium">Result:</span> {new Date(test.resultDate).toLocaleDateString()}
                                                        </div>
                                                    )}
                                                </div>
                                                {test.resultNotes && (
                                                    <div className="mt-2 pt-2 border-t border-gray-200">
                                                        <p className="text-sm text-gray-600"><span className="font-medium">Notes:</span> {test.resultNotes}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <BeakerIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                        <p className="text-gray-500">No lab tests requested yet.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Prescription Tab */}
                        {activeTab === 'prescription' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="text-lg font-medium text-gray-900">Prescription</h4>
                                    <button
                                        onClick={() => setShowPrescriptionModal(true)}
                                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        <ClipboardDocumentListIcon className="h-4 w-4 mr-2" />
                                        Create Prescription
                                    </button>
                                </div>

                                {appointment.prescriptionId ? (
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <h5 className="font-medium text-gray-900">
                                                Prescription #{appointment.prescriptionId.prescriptionId}
                                            </h5>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${appointment.prescriptionId.status === 'active' ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-800'
                                                }`}>
                                                {appointment.prescriptionId.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Date: {new Date(appointment.prescriptionId.date).toLocaleDateString()}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                        <p className="text-gray-500">No prescription created yet.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                    <button
                        onClick={() => setShowLabModal(true)}
                        className="inline-flex items-center justify-center px-6 py-3 border border-purple-600 text-base font-medium rounded-lg text-purple-600 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Request Lab Tests
                    </button>
                    <button
                        onClick={() => setShowPrescriptionModal(true)}
                        className="inline-flex items-center justify-center px-6 py-3 border border-green-600 text-base font-medium rounded-lg text-green-600 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
                        Write Prescription
                    </button>
                    <button
                        onClick={() => setShowStatusModal(true)}
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <DocumentCheckIcon className="h-5 w-5 mr-2" />
                        Complete Appointment
                    </button>
                </div>
            </div>

            {/* Lab Test Modal (Updated for multiple tests) */}
            {showLabModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900">Request Lab Tests</h3>
                            <button
                                onClick={() => setShowLabModal(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-sm font-medium text-gray-700">Tests to Request</h4>
                                    <button
                                        onClick={handleAddTest}
                                        className="inline-flex items-center px-3 py-1 text-sm text-purple-600 hover:text-purple-800"
                                    >
                                        <PlusIcon className="h-4 w-4 mr-1" />
                                        Add Another Test
                                    </button>
                                </div>
                                <p className="text-sm text-gray-500 mb-4">Add one or more lab tests to request for this appointment.</p>
                            </div>

                            {labTestForm.tests.map((test, index) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
                                    <div className="flex justify-between items-center mb-3">
                                        <h5 className="font-medium text-gray-900">Test #{index + 1}</h5>
                                        <button
                                            onClick={() => handleRemoveTest(index)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Test Name *
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                value={test.testName}
                                                onChange={(e) => handleTestChange(index, 'testName', e.target.value)}
                                                placeholder="e.g., Complete Blood Count"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Test Type
                                            </label>
                                            <select
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                value={test.testType}
                                                onChange={(e) => handleTestChange(index, 'testType', e.target.value)}
                                            >
                                                <option value="blood">Blood Test</option>
                                                <option value="urine">Urine Test</option>
                                                <option value="stool">Stool Test</option>
                                                <option value="tissue">Tissue Test</option>
                                                <option value="culture">Culture</option>
                                                <option value="imaging">Imaging</option>
                                                <option value="molecular">Molecular</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Priority
                                            </label>
                                            <select
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                value={test.priority}
                                                onChange={(e) => handleTestChange(index, 'priority', e.target.value)}
                                            >
                                                <option value="routine">Routine</option>
                                                <option value="urgent">Urgent</option>
                                                <option value="stat">STAT</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Specimen Type
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                value={test.specimenType}
                                                onChange={(e) => handleTestChange(index, 'specimenType', e.target.value)}
                                                placeholder="e.g., Blood, Urine, Tissue"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Specimen Details
                                        </label>
                                        <textarea
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                            rows="2"
                                            value={test.specimenDetails}
                                            onChange={(e) => handleTestChange(index, 'specimenDetails', e.target.value)}
                                            placeholder="Additional details about the specimen"
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Assign Lab Technician(s) for this Test
                                        </label>
                                        <select
                                            multiple
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-32"
                                            value={test.labTechnicianIds || []}  // Change this line
                                            onChange={(e) => {
                                                const updatedTests = [...labTestForm.tests];
                                                updatedTests[index].labTechnicianIds = Array.from(e.target.selectedOptions, option => option.value);
                                                setLabTestForm({ ...labTestForm, tests: updatedTests });
                                            }}
                                        >
                                            <option value="">Select technicians (Hold Ctrl/Cmd to select multiple)</option>
                                            {labTechnicians.map(tech => (
                                                <option key={tech._id} value={tech._id}>
                                                    {tech.firstName} {tech.lastName} ({tech.email})
                                                </option>
                                            ))}
                                        </select>
                                        <p className="mt-1 text-sm text-gray-500">
                                            {test.labTechnicianIds?.length || 0} technician(s) selected
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Notes
                                        </label>
                                        <textarea
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                            rows="2"
                                            value={test.notes}
                                            onChange={(e) => handleTestChange(index, 'notes', e.target.value)}
                                            placeholder="Special instructions or notes"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                            <div className="text-sm text-gray-600">
                                Total Tests: {labTestForm.tests.length}
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowLabModal(false)}
                                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateLabTest}
                                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                >
                                    Request {labTestForm.tests.length > 1 ? `${labTestForm.tests.length} Tests` : 'Test'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Prescription Modal (No changes needed) */}
            {showPrescriptionModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900">Create Prescription</h3>
                            <button
                                onClick={() => setShowPrescriptionModal(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-6">
                            <h4 className="text-sm font-medium text-gray-900 mb-3">Medications</h4>
                            {prescriptionForm.medications.map((med, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Medicine Name
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                value={med.medicineName}
                                                onChange={(e) => handleMedicationChange(index, 'medicineName', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Dosage
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                value={med.dosage}
                                                onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                                                placeholder="e.g., 500mg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Frequency
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                value={med.frequency}
                                                onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                                                placeholder="e.g., 3 times daily"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Duration
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                value={med.duration}
                                                onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                                                placeholder="e.g., 7 days"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Quantity
                                            </label>
                                            <input
                                                type="number"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                value={med.quantity}
                                                onChange={(e) => handleMedicationChange(index, 'quantity', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button
                                onClick={handleAddMedication}
                                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-gray-800 hover:border-gray-400 mb-6"
                            >
                                + Add Another Medication
                            </button>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Diagnosis
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    value={prescriptionForm.diagnosis.join(', ')}
                                    onChange={(e) => setPrescriptionForm({
                                        ...prescriptionForm,
                                        diagnosis: e.target.value.split(',')
                                    })}
                                    placeholder="Enter diagnosis separated by commas"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Notes
                                </label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    rows="3"
                                    value={prescriptionForm.notes}
                                    onChange={(e) => setPrescriptionForm({ ...prescriptionForm, notes: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Valid Until
                                </label>
                                <input
                                    type="date"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    value={prescriptionForm.validUntil}
                                    onChange={(e) => setPrescriptionForm({ ...prescriptionForm, validUntil: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowPrescriptionModal(false)}
                                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreatePrescription}
                                className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                Create Prescription
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Status Update Modal (No changes needed) */}
            {showStatusModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900">Update Appointment Status</h3>
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    value={statusForm.status}
                                    onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Consultation Notes
                                </label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    rows="3"
                                    value={statusForm.consultationNotes}
                                    onChange={(e) => setStatusForm({ ...statusForm, consultationNotes: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Follow-up Date
                                </label>
                                <input
                                    type="date"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    value={statusForm.followUpDate}
                                    onChange={(e) => setStatusForm({ ...statusForm, followUpDate: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateStatus}
                                className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Update Status
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notifications */}
            {success && (
                <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
                    <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <CheckCircleIcon className="h-5 w-5 text-green-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-green-700">{success}</p>
                            </div>
                            <div className="ml-auto pl-3">
                                <button
                                    onClick={() => setSuccess('')}
                                    className="inline-flex text-green-700 hover:text-green-600"
                                >
                                    <XMarkIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                            <div className="ml-auto pl-3">
                                <button
                                    onClick={() => setError('')}
                                    className="inline-flex text-red-700 hover:text-red-600"
                                >
                                    <XMarkIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorAppointmentDetails;
