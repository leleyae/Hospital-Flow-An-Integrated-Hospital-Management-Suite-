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
    ChevronRightIcon,
    ChevronLeftIcon,
    EyeIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    UserCircleIcon,
    ClipboardDocumentListIcon,
    DocumentCheckIcon,
    TrashIcon,
    PlusIcon,
    MagnifyingGlassIcon,
    CurrencyDollarIcon,
    ReceiptPercentIcon,
    CreditCardIcon,
    ShieldCheckIcon,
    ChartBarIcon,
    DocumentArrowDownIcon,
    DocumentTextIcon,
    BuildingOfficeIcon,
    IdentificationIcon
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
    const [showLabResultsModal, setShowLabResultsModal] = useState(false);
    const [selectedLabTest, setSelectedLabTest] = useState(null);
    const [expandedTestIds, setExpandedTestIds] = useState([]);
    const [medicines, setMedicines] = useState([]);
    const [filteredMedicines, setFilteredMedicines] = useState([]);
    const [showMedicineSearchIndex, setShowMedicineSearchIndex] = useState(null);
    const [medicineSearchTerm, setMedicineSearchTerm] = useState('');
    const [consultationNotes, setConsultationNotes] = useState('');

    // New state for billing
    const [labTestPrices, setLabTestPrices] = useState([]);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [selectedTestsForBilling, setSelectedTestsForBilling] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [showInvoicesModal, setShowInvoicesModal] = useState(false);
    const [showPriceList, setShowPriceList] = useState(false);
    const [filteredPrices, setFilteredPrices] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedType, setSelectedType] = useState('');

    const [labTestForm, setLabTestForm] = useState({
        tests: [{
            testName: '',
            testType: 'blood',
            priority: 'routine',
            specimenType: '',
            specimenDetails: '',
            notes: '',
            labTechnicianIds: [],
            estimatedPrice: 0,
            testCode: ''
        }]
    });

    const [prescriptionForm, setPrescriptionForm] = useState({
        medications: [{
            medicineName: '',
            dosage: '',
            frequency: '',
            duration: '',
            quantity: 1,
            instructions: '',
            medicineId: '',
            unitPrice: 0,
            genericName: '',
            refills: 0
        }],
        diagnosis: [''],
        notes: '',
        validUntil: ''
    });

    const [statusForm, setStatusForm] = useState({
        status: 'pending',
        consultationNotes: '',
        followUpDate: ''
    });

    const [invoiceForm, setInvoiceForm] = useState({
        labTestIds: [],
        discount: 0,
        tax: 0,
        paymentMethod: 'cash',
        notes: '',
        insuranceInfo: {
            insuranceProvider: '',
            policyNumber: '',
            claimAmount: 0
        }
    });

    // Fetch appointment details
    const fetchAppointmentDetails = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/doctor/appointments/${appointmentId}`);
            setAppointment(response.data.data);
            setConsultationNotes(response.data.data.consultationNotes || '');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch appointment details');
        } finally {
            setLoading(false);
        }
    };

    // Fetch lab technicians
    const fetchLabTechnicians = async () => {
        try {
            const response = await api.get('/doctor/lab-technicians');
            setLabTechnicians(response.data.data);
        } catch (err) {
            console.error('Failed to fetch technicians:', err);
        }
    };

    // Fetch medicines
    const fetchMedicines = async () => {
        try {
            const response = await api.get('/pharmacy/inventory');
            setMedicines(response.data.data);
            setFilteredMedicines(response.data.data);
        } catch (err) {
            console.error('Failed to fetch medicines:', err);
        }
    };

    // Fetch lab test prices
    const fetchLabTestPrices = async () => {
        try {
            const response = await api.get('/doctor/lab-test-prices');
            setLabTestPrices(response.data.data);
            setFilteredPrices(response.data.data);
        } catch (err) {
            console.error('Failed to fetch lab test prices:', err);
        }
    };

    // Fetch invoices for this appointment
    const fetchAppointmentInvoices = async () => {
        try {
            const response = await api.get(`/doctor/appointments/${appointmentId}/invoices`);
            setInvoices(response.data.data);
        } catch (err) {
            console.error('Failed to fetch invoices:', err);
        }
    };

    // Filter lab test prices
    useEffect(() => {
        let filtered = labTestPrices;

        if (searchTerm) {
            filtered = filtered.filter(price =>
                price.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                price.testCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                price.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory) {
            filtered = filtered.filter(price => price.category === selectedCategory);
        }

        if (selectedType) {
            filtered = filtered.filter(price => price.testType === selectedType);
        }

        setFilteredPrices(filtered);
    }, [searchTerm, selectedCategory, selectedType, labTestPrices]);

    // Calculate test price based on priority
    const calculateTestPrice = (testName, priority) => {
        const priceInfo = labTestPrices.find(price => price.testName === testName);
        if (!priceInfo) return 0;

        switch (priority) {
            case 'urgent':
                return priceInfo.urgentPrice || priceInfo.basePrice * 1.5;
            case 'stat':
                return priceInfo.statPrice || priceInfo.basePrice * 2;
            default:
                return priceInfo.basePrice;
        }
    };

    // When test name changes, update price and test code
    const handleTestNameChange = (index, value) => {
        const priceInfo = labTestPrices.find(price => price.testName === value);
        const updatedTests = [...labTestForm.tests];

        updatedTests[index].testName = value;
        if (priceInfo) {
            updatedTests[index].testCode = priceInfo.testCode;
            updatedTests[index].testType = priceInfo.testType;
            updatedTests[index].estimatedPrice = calculateTestPrice(value, updatedTests[index].priority);
        }

        setLabTestForm({ ...labTestForm, tests: updatedTests });
    };

    // When priority changes, update price
    const handleTestPriorityChange = (index, value) => {
        const updatedTests = [...labTestForm.tests];
        updatedTests[index].priority = value;

        if (updatedTests[index].testName) {
            updatedTests[index].estimatedPrice = calculateTestPrice(
                updatedTests[index].testName,
                value
            );
        }

        setLabTestForm({ ...labTestForm, tests: updatedTests });
    };

    // Initialize billing for selected tests
    const handleInitiateBilling = (testIds) => {
        setSelectedTestsForBilling(testIds);
        setInvoiceForm({
            ...invoiceForm,
            labTestIds: testIds
        });
        setShowInvoiceModal(true);
    };

    // Calculate invoice totals
    const calculateInvoiceTotals = () => {
        const subtotal = labTestForm.tests.reduce((sum, test) => sum + test.estimatedPrice, 0);
        const taxAmount = (subtotal * invoiceForm.tax) / 100;
        const discountAmount = (subtotal * invoiceForm.discount) / 100;
        const total = subtotal + taxAmount - discountAmount;

        return {
            subtotal,
            tax: taxAmount,
            discount: discountAmount,
            total
        };
    };

    // Create invoice for selected lab tests
    const handleCreateInvoice = async () => {
        try {
            await api.post(
                `/doctor/appointments/${appointmentId}/invoices/lab-tests`,
                invoiceForm
            );

            setSuccess('Invoice created successfully');
            setShowInvoiceModal(false);
            fetchAppointmentInvoices();
            fetchAppointmentDetails();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create invoice');
        }
    };

    // Save consultation notes
    const handleSaveConsultationNotes = async () => {
        try {
            await api.put(`/doctor/appointments/${appointmentId}/consultation-notes`, {
                consultationNotes: consultationNotes
            });
            setSuccess('Consultation notes saved successfully');
            fetchAppointmentDetails();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save consultation notes');
        }
    };

    // Update appointment status
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

    // Create lab test
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

            const payload = {
                tests: validTests.map(test => ({
                    testName: test.testName,
                    testType: test.testType,
                    priority: test.priority,
                    specimenType: test.specimenType,
                    specimenDetails: test.specimenDetails,
                    notes: test.notes,
                    labTechnicianIds: test.labTechnicianIds
                }))
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
                    labTechnicianIds: [],
                    estimatedPrice: 0,
                    testCode: ''
                }]
            });
            fetchAppointmentDetails();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create lab test');
        }
    };

    // Create prescription
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

    // Add medication
    const handleAddMedication = () => {
        setPrescriptionForm({
            ...prescriptionForm,
            medications: [...prescriptionForm.medications, {
                medicineName: '',
                dosage: '',
                frequency: '',
                duration: '',
                quantity: 1,
                instructions: '',
                medicineId: '',
                unitPrice: 0,
                genericName: '',
                refills: 0
            }]
        });
    };

    // Handle medication change
    const handleMedicationChange = (index, field, value) => {
        const updatedMedications = [...prescriptionForm.medications];
        updatedMedications[index][field] = value;
        setPrescriptionForm({ ...prescriptionForm, medications: updatedMedications });
    };

    // Add test
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
                labTechnicianIds: [],
                estimatedPrice: 0,
                testCode: ''
            }]
        });
    };

    // Remove test
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
                labTechnicianIds: [],
                estimatedPrice: 0,
                testCode: ''
            };
            setLabTestForm({ ...labTestForm, tests: updatedTests });
        } else {
            const updatedTests = labTestForm.tests.filter((_, i) => i !== index);
            setLabTestForm({ ...labTestForm, tests: updatedTests });
        }
    };

    // Handle test change
    const handleTestChange = (index, field, value) => {
        const updatedTests = [...labTestForm.tests];
        updatedTests[index][field] = value;
        setLabTestForm({ ...labTestForm, tests: updatedTests });
    };

    // Handle view lab test results
    const handleViewLabTestResults = async (testId) => {
        try {
            const response = await api.get(`/doctor/lab-tests/${testId}/results`);
            setSelectedLabTest(response.data.data);
            setShowLabResultsModal(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch lab test results');
        }
    };

    // Toggle test expansion
    const toggleTestExpansion = (testId) => {
        setExpandedTestIds(prev =>
            prev.includes(testId)
                ? prev.filter(id => id !== testId)
                : [...prev, testId]
        );
    };

    // Get test status color
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

    // Get priority color
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'stat': return 'bg-red-100 text-red-800';
            case 'urgent': return 'bg-orange-100 text-orange-800';
            case 'routine': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            case 'in-progress': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Filter medicines
    const filterMedicines = (searchTerm) => {
        if (!searchTerm.trim()) {
            setFilteredMedicines(medicines);
            return;
        }

        const filtered = medicines.filter(medicine =>
            medicine.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            medicine.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            medicine.medicineId.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMedicines(filtered);
    };

    // Handle medicine search
    const handleMedicineSearch = (index, searchTerm) => {
        setMedicineSearchTerm(searchTerm);
        filterMedicines(searchTerm);
        setShowMedicineSearchIndex(index);
    };

    // Close medicine search
    const closeMedicineSearch = () => {
        setShowMedicineSearchIndex(null);
        setMedicineSearchTerm('');
    };

    // Fetch all data on component mount
    useEffect(() => {
        fetchAppointmentDetails();
        fetchLabTechnicians();
        fetchMedicines();
        fetchLabTestPrices();
        fetchAppointmentInvoices();
    }, [appointmentId]);

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-4 text-gray-600">Loading appointment details...</p>
            </div>
        </div>
    );

    if (error && !appointment) return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">Error</h3>
                <p className="mt-2 text-lg text-gray-500 text-center">{error}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Go Back
                </button>
            </div>
        </div>
    );

    if (!appointment) return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
            <div className="text-center">
                <InformationCircleIcon className="h-12 w-12 text-yellow-500 mx-auto" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">Appointment Not Found</h3>
                <p className="mt-2 text-lg text-gray-500">The requested appointment could not be found.</p>
            </div>
        </div>
    );

    const patient = appointment.patientId;
    const doctor = appointment.doctorId;
    const labTests = appointment.labTests || [];

    // Calculate total lab test cost
    const totalLabTestCost = labTests.reduce((sum, test) => {
        const price = calculateTestPrice(test.testName, test.priority);
        return sum + price;
    }, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
            {/* Enhanced Header */}
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center text-lg font-medium text-blue-600 hover:text-blue-800 mb-4 transition-colors duration-200"
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-1" />
                        Back to Appointments
                    </button>

                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Appointment Details
                            </h1>
                            <div className="flex items-center space-x-4 mt-2">
                                <p className="text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">
                                    ID: {appointment.appointmentId}
                                </p>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-lg font-medium ${getStatusColor(appointment.appointmentStatus)} shadow-sm`}>
                                    {appointment.appointmentStatus.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 mt-4 md:mt-0">
                            <button
                                onClick={() => setShowInvoicesModal(true)}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-lg font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
                            >
                                <ReceiptPercentIcon className="h-4 w-4 mr-2" />
                                View Invoices ({invoices.length})
                            </button>
                            <button
                                onClick={() => setShowStatusModal(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-lg font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
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
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform duration-200 hover:scale-[1.02]">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <UserIcon className="h-5 w-5 mr-2 text-blue-500" />
                                Patient Information
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <div className="flex-shrink-0">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                                        <span className="text-white font-semibold text-lg">
                                            {patient?.userId?.firstName?.charAt(0)}
                                        </span>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-lg font-semibold text-gray-900">
                                        {patient?.userId?.firstName} {patient?.userId?.lastName}
                                    </h4>
                                    <p className="text-lg text-gray-500">ID: {patient?.patientId}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center text-lg text-gray-600">
                                    <svg className="h-4 w-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                    {patient?.userId?.email}
                                </div>
                                <div className="flex items-center text-lg text-gray-600">
                                    <svg className="h-4 w-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                    </svg>
                                    {patient?.userId?.phoneNumber}
                                </div>

                                {patient?.medicalHistory && (
                                    <div className="pt-3 border-t border-gray-100">
                                        <p className="text-lg font-medium text-gray-700 mb-1">Medical History</p>
                                        <p className="text-lg text-gray-600">{patient.medicalHistory}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Appointment Card */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform duration-200 hover:scale-[1.02]">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <CalendarIcon className="h-5 w-5 mr-2 text-green-500" />
                                Appointment Details
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-center text-lg">
                                    <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
                                    <span className="text-gray-700">
                                        {new Date(appointment.appointmentDate).toLocaleDateString()} • {appointment.startTime} - {appointment.endTime}
                                    </span>
                                </div>

                                <div>
                                    <p className="text-lg font-medium text-gray-700 mb-1">Reason</p>
                                    <p className="text-lg text-gray-600">{appointment.reason || 'Not specified'}</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-medium text-gray-700">Priority</span>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-lg font-medium ${getPriorityColor(appointment.priority)}`}>
                                        {appointment.priority.toUpperCase()}
                                    </span>
                                </div>

                                {appointment.symptoms && appointment.symptoms.length > 0 && (
                                    <div>
                                        <p className="text-lg font-medium text-gray-700 mb-2">Symptoms</p>
                                        <div className="flex flex-wrap gap-1">
                                            {appointment.symptoms.map((symptom, index) => (
                                                <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-lg font-medium bg-purple-100 text-purple-800">
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
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform duration-200 hover:scale-[1.02]">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-indigo-100">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <UserCircleIcon className="h-5 w-5 mr-2 text-indigo-500" />
                                Doctor Information
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-lg font-medium text-gray-700 mb-1">Doctor</p>
                                    <p className="text-lg text-gray-900 font-semibold">
                                        Dr. {doctor?.userId?.firstName} {doctor?.userId?.lastName}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-lg text-gray-500">Specialization</p>
                                        <p className="text-lg text-gray-900">{doctor?.specialization}</p>
                                    </div>
                                    <div>
                                        <p className="text-lg text-gray-500">Department</p>
                                        <p className="text-lg text-gray-900">{doctor?.department}</p>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-gray-100">
                                    <p className="text-lg font-medium text-gray-700 mb-1">Consultation Fee</p>
                                    <p className="text-lg font-bold text-indigo-600">${doctor?.consultationFee}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Tab Navigation */}
                <div className="mb-8">
                    <div className="flex space-x-1 bg-white rounded-xl p-1 shadow-lg">
                        {['consultation', 'triage', 'lab', 'prescription', 'billing'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-3 px-4 text-lg font-medium rounded-lg transition-all duration-200 ${activeTab === tab
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                            >
                                <div className="flex items-center justify-center">
                                    {tab === 'consultation' && (
                                        <>
                                            <ClipboardDocumentListIcon className="h-4 w-4 mr-2" />
                                            Consultation
                                        </>
                                    )}
                                    {tab === 'triage' && (
                                        <>
                                            <ChartBarIcon className="h-4 w-4 mr-2" />
                                            Triage
                                        </>
                                    )}
                                    {tab === 'lab' && (
                                        <div className="flex items-center">
                                            <BeakerIcon className="h-4 w-4 mr-2" />
                                            Lab Tests
                                            {labTests.length > 0 && (
                                                <span className="ml-2 bg-blue-100 text-blue-800 text-lg font-medium px-2 py-0.5 rounded-full">
                                                    {labTests.length}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    {tab === 'prescription' && (
                                        <>
                                            <DocumentCheckIcon className="h-4 w-4 mr-2" />
                                            Prescription
                                        </>
                                    )}
                                    {tab === 'billing' && (
                                        <div className="flex items-center">
                                            <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                                            Billing
                                            {invoices.length > 0 && (
                                                <span className="ml-2 bg-green-100 text-green-800 text-lg font-medium px-2 py-0.5 rounded-full">
                                                    {invoices.length}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Consultation Tab */}
                    {activeTab === 'consultation' && (
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Consultation Notes</h3>
                            <textarea
                                className="w-full h-48 px-4 py-3 text-gray-700 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                value={consultationNotes}
                                onChange={(e) => setConsultationNotes(e.target.value)}
                                placeholder="Enter consultation notes..."
                            />
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={handleSaveConsultationNotes}
                                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
                                >
                                    Save Notes
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Triage Tab */}
                    {activeTab === 'triage' && (
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Triage Information & Vital Signs</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-2">
                                        Blood Pressure
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                        placeholder="e.g., 120/80"
                                        value={appointment.triageNotes?.vitalSigns?.bloodPressure || ''}
                                    />
                                </div>
                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-2">
                                        Heart Rate (BPM)
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                        value={appointment.triageNotes?.vitalSigns?.heartRate || ''}
                                    />
                                </div>
                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-2">
                                        Temperature (°C)
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                        value={appointment.triageNotes?.vitalSigns?.temperature || ''}
                                    />
                                </div>
                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-2">
                                        Oxygen Saturation (%)
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                        value={appointment.triageNotes?.vitalSigns?.oxygenSaturation || ''}
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm transition-all duration-200">
                                    Save Vitals
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Lab Tests Tab */}
                    {activeTab === 'lab' && (
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Lab Tests</h3>

                                </div>
                                <div className="flex space-x-3">

                                    <button
                                        onClick={() => setShowLabModal(true)}
                                        className="inline-flex items-center px-4 py-2 text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-sm transition-all duration-200"
                                    >
                                        <PlusIcon className="h-4 w-4 mr-2" />
                                        Request Lab Tests
                                    </button>
                                </div>
                            </div>

                            {labTests.length > 0 ? (
                                <div className="space-y-4">
                                    {labTests.map((test, index) => (
                                        <div key={test._id} className="bg-white rounded-xl border border-gray-200 hover:border-purple-300 transition-all duration-200 overflow-hidden shadow-sm">
                                            <div className="p-4 cursor-pointer hover:bg-gray-50" onClick={() => toggleTestExpansion(test._id)}>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <BeakerIcon className="h-5 w-5 text-purple-500 mr-2" />
                                                        <div>
                                                            <h5 className="font-semibold text-gray-900">{test.testName}</h5>
                                                            <p className="text-lg text-gray-500">
                                                                {test.testType} • {test.specimenType || 'Not specified'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-lg font-medium ${getPriorityColor(test.priority)}`}>
                                                            {test.priority.toUpperCase()}
                                                        </span>
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-lg font-medium ${getTestStatusColor(test.status)}`}>
                                                            {test.status.replace('_', ' ').toUpperCase()}
                                                        </span>
                                                        <span className="font-bold text-blue-600">
                                                            ${calculateTestPrice(test.testName, test.priority).toFixed(2)}
                                                        </span>
                                                        <ChevronRightIcon
                                                            className={`h-4 w-4 text-gray-400 transition-transform ${expandedTestIds.includes(test._id) ? 'transform rotate-90' : ''}`}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {expandedTestIds.includes(test._id) && (
                                                <div className="border-t border-gray-200 p-4 bg-gray-50">
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-lg text-gray-600 mb-4">
                                                        <div>
                                                            <span className="font-medium">Requested:</span> {new Date(test.requestedDate).toLocaleDateString()}
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Status:</span> {test.status.replace('_', ' ')}
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Priority:</span> {test.priority}
                                                        </div>
                                                        {test.collectionDate && (
                                                            <div>
                                                                <span className="font-medium">Collected:</span> {new Date(test.collectionDate).toLocaleDateString()}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {test.status === 'completed' && test.testParameters && test.testParameters.length > 0 && (
                                                        <div className="mb-4">
                                                            <h6 className="text-lg font-medium text-gray-700 mb-2">Test Results</h6>
                                                            <div className="bg-white rounded border overflow-hidden">
                                                                <table className="min-w-full divide-y divide-gray-200">
                                                                    <thead className="bg-gray-50">
                                                                        <tr>
                                                                            <th className="px-4 py-2 text-left text-lg font-medium text-gray-500 uppercase">Parameter</th>
                                                                            <th className="px-4 py-2 text-left text-lg font-medium text-gray-500 uppercase">Value</th>
                                                                            <th className="px-4 py-2 text-left text-lg font-medium text-gray-500 uppercase">Unit</th>
                                                                            <th className="px-4 py-2 text-left text-lg font-medium text-gray-500 uppercase">Normal Range</th>
                                                                            <th className="px-4 py-2 text-left text-lg font-medium text-gray-500 uppercase">Notes</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="divide-y divide-gray-200">
                                                                        {test.testParameters.map((param, idx) => (
                                                                            <tr key={idx}>
                                                                                <td className="px-4 py-2 text-lg">{param.parameter}</td>
                                                                                <td className="px-4 py-2 text-lg font-medium">{param.value}</td>
                                                                                <td className="px-4 py-2 text-lg">{param.unit}</td>
                                                                                <td className="px-4 py-2 text-lg">{param.normalRange}</td>
                                                                                <td className="px-4 py-2 text-lg">{param.notes || '-'}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                                        <div className="text-lg text-gray-500">
                                                            Test ID: {test.testId}
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            {test.status === 'completed' && (
                                                                <button
                                                                    onClick={() => handleViewLabTestResults(test._id)}
                                                                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 text-lg font-medium rounded-lg hover:bg-blue-200 transition-colors duration-200"
                                                                >
                                                                    <EyeIcon className="h-4 w-4 mr-1" />
                                                                    View Full Report
                                                                </button>
                                                            )}

                                                        </div>
                                                    </div>
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
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Prescription</h3>
                                {!appointment.prescriptionId && (
                                    <button
                                        onClick={() => setShowPrescriptionModal(true)}
                                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm transition-all duration-200"
                                    >
                                        <ClipboardDocumentListIcon className="h-4 w-4 mr-2" />
                                        Create Prescription
                                    </button>
                                )}
                            </div>

                            {appointment.prescriptionId ? (
                                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h5 className="font-semibold text-gray-900">
                                                    Prescription #{appointment.prescriptionId.prescriptionId}
                                                </h5>
                                                <p className="text-lg text-gray-500">
                                                    Date: {new Date(appointment.prescriptionId.date).toLocaleDateString()}
                                                    {appointment.prescriptionId.validUntil && (
                                                        <span className="ml-4">
                                                            Valid until: {new Date(appointment.prescriptionId.validUntil).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-lg font-medium ${appointment.prescriptionId.status === 'active' ? 'bg-green-100 text-green-800' :
                                                appointment.prescriptionId.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                {appointment.prescriptionId.status.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>

                                    {appointment.prescriptionId.diagnosis && appointment.prescriptionId.diagnosis.length > 0 && (
                                        <div className="px-6 py-4 border-b border-gray-200">
                                            <h6 className="text-lg font-medium text-gray-700 mb-2">Diagnosis</h6>
                                            <div className="flex flex-wrap gap-2">
                                                {appointment.prescriptionId.diagnosis.map((diag, index) => (
                                                    diag.trim() && (
                                                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-lg font-medium bg-blue-100 text-blue-800">
                                                            {diag}
                                                        </span>
                                                    )
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="px-6 py-4">
                                        <h6 className="text-lg font-medium text-gray-700 mb-4">Medications</h6>
                                        {appointment.prescriptionId.medications && appointment.prescriptionId.medications.length > 0 ? (
                                            <div className="space-y-4">
                                                {appointment.prescriptionId.medications.map((med, index) => (
                                                    <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <h6 className="font-medium text-gray-900">{med.medicineName}</h6>
                                                                {med.genericName && (
                                                                    <p className="text-lg text-gray-500">({med.genericName})</p>
                                                                )}
                                                            </div>
                                                            {med.isDispensed ? (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-lg font-medium bg-green-100 text-green-800">
                                                                    <CheckCircleIcon className="h-3 w-3 mr-1" />
                                                                    Dispensed
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-lg font-medium bg-yellow-100 text-yellow-800">
                                                                    Pending
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-lg text-gray-600 mt-3">
                                                            <div>
                                                                <span className="font-medium">Dosage:</span> {med.dosage}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">Frequency:</span> {med.frequency}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">Duration:</span> {med.duration}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">Quantity:</span> {med.quantity}
                                                            </div>
                                                        </div>

                                                        {med.instructions && (
                                                            <div className="mt-3 pt-3 border-t border-gray-200">
                                                                <span className="text-lg font-medium text-gray-700">Instructions:</span>
                                                                <p className="text-lg text-gray-600 mt-1">{med.instructions}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 text-center py-4">No medications prescribed</p>
                                        )}
                                    </div>

                                    {appointment.prescriptionId.notes && (
                                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                                            <h6 className="text-lg font-medium text-gray-700 mb-2">Additional Notes</h6>
                                            <p className="text-lg text-gray-600">{appointment.prescriptionId.notes}</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-500">No prescription created yet.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Billing Tab */}
                    {activeTab === 'billing' && (
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Billing & Invoices</h3>
                                    <p className="text-lg text-gray-500 mt-1">Manage invoices and payments for this appointment</p>
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => setShowPriceList(true)}
                                        className="inline-flex items-center px-4 py-2 text-lg font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                                    >
                                        <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                                        View Price List
                                    </button>
                                    {labTests.length > 0 && (
                                        <button
                                            onClick={() => handleInitiateBilling(labTests.map(test => test._id))}
                                            className="inline-flex items-center px-4 py-2 text-lg font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm transition-all duration-200"
                                        >
                                            <ReceiptPercentIcon className="h-4 w-4 mr-2" />
                                            Create Invoice
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Invoices Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
                                    <div className="flex items-center">
                                        <div className="bg-blue-100 p-3 rounded-lg">
                                            <ReceiptPercentIcon className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-lg text-blue-700">Total Invoices</p>
                                            <p className="text-2xl font-bold text-blue-900">{invoices.length}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200">
                                    <div className="flex items-center">
                                        <div className="bg-green-100 p-3 rounded-lg">
                                            <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-lg text-green-700">Total Amount</p>
                                            <p className="text-2xl font-bold text-green-900">
                                                ${invoices.reduce((sum, inv) => sum + inv.totalAmount, 0).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200">
                                    <div className="flex items-center">
                                        <div className="bg-purple-100 p-3 rounded-lg">
                                            <ShieldCheckIcon className="h-6 w-6 text-purple-600" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-lg text-purple-700">Paid Amount</p>
                                            <p className="text-2xl font-bold text-purple-900">
                                                ${invoices.reduce((sum, inv) => sum + inv.amountPaid, 0).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Invoices List */}
                            <div className="bg-gray-50 rounded-xl p-1 mb-6">
                                <h4 className="text-lg font-semibold text-gray-700 px-4 py-3">Recent Invoices</h4>
                                {invoices.length > 0 ? (
                                    <div className="space-y-2">
                                        {invoices.map((invoice) => (
                                            <div key={invoice._id} className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <div className="flex items-center">
                                                            <div className="bg-blue-100 p-2 rounded-lg">
                                                                <ReceiptPercentIcon className="h-5 w-5 text-blue-600" />
                                                            </div>
                                                            <div className="ml-3">
                                                                <h5 className="font-medium text-gray-900">
                                                                    Invoice #{invoice.invoiceId}
                                                                </h5>
                                                                <p className="text-lg text-gray-500">
                                                                    {new Date(invoice.invoiceDate).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-bold text-gray-900">
                                                            ${invoice.totalAmount.toFixed(2)}
                                                        </p>
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-lg font-medium ${invoice.status === 'paid'
                                                            ? 'bg-green-100 text-green-800'
                                                            : invoice.status === 'partial'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-red-100 text-red-800'
                                                            }`}>
                                                            {invoice.status.toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="mt-4 pt-4 border-t border-gray-100">
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-lg">
                                                        <div>
                                                            <span className="text-gray-600">Items:</span>
                                                            <span className="ml-2 font-medium">{invoice.items?.length || 0}</span>
                                                        </div>

                                                        <div>
                                                            <span className="text-gray-600">Due:</span>
                                                            <span className="ml-2 font-medium">
                                                                {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10">
                                        <CurrencyDollarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                        <p className="text-gray-500">No invoices created yet</p>
                                        <p className="text-lg text-gray-400 mt-1">Create an invoice for lab tests or other services</p>
                                    </div>
                                )}
                            </div>

                            {/* Lab Tests Ready for Billing */}
                            {labTests.filter(test => !test.billingId).length > 0 && (
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900">Pending Billing</h4>
                                            <p className="text-lg text-gray-600">
                                                {labTests.filter(test => !test.billingId).length} lab tests ready for invoicing
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleInitiateBilling(
                                                labTests.filter(test => !test.billingId).map(test => test._id)
                                            )}
                                            className="inline-flex items-center px-4 py-2 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
                                        >
                                            <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                                            Create Invoice for All
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        {labTests
                                            .filter(test => !test.billingId)
                                            .map((test) => {
                                                const priceInfo = labTestPrices.find(p => p.testName === test.testName);
                                                const price = calculateTestPrice(test.testName, test.priority);

                                                return (
                                                    <div key={test._id} className="bg-white rounded-lg p-3 flex justify-between items-center">
                                                        <div>
                                                            <p className="font-medium text-gray-900">{test.testName}</p>
                                                            <p className="text-lg text-gray-500">
                                                                {test.testType} • {test.priority} priority
                                                            </p>
                                                        </div>

                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                <button
                    onClick={() => setShowLabModal(true)}
                    className="inline-flex items-center justify-center px-6 py-3 border border-purple-600 text-base font-medium rounded-xl text-purple-600 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Request Lab Tests
                </button>
                <button
                    onClick={() => setShowPrescriptionModal(true)}
                    className="inline-flex items-center justify-center px-6 py-3 border border-green-600 text-base font-medium rounded-xl text-green-600 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                >
                    <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
                    Write Prescription
                </button>
                <button
                    onClick={() => setShowStatusModal(true)}
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
                >
                    <DocumentCheckIcon className="h-5 w-5 mr-2" />
                    Complete Appointment
                </button>
            </div>

            {/* Price List Modal */}
            {showPriceList && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Lab Test Price List</h3>
                                <p className="text-lg text-gray-500">Browse available lab tests and their prices</p>
                            </div>
                            <button
                                onClick={() => setShowPriceList(false)}
                                className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="relative">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search tests..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <select
                                    className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option value="">All Categories</option>
                                    <option value="hematology">Hematology</option>
                                    <option value="biochemistry">Biochemistry</option>
                                    <option value="microbiology">Microbiology</option>
                                    <option value="serology">Serology</option>
                                    <option value="radiology">Radiology</option>
                                    <option value="pathology">Pathology</option>
                                    <option value="genetic">Genetic</option>
                                    <option value="other">Other</option>
                                </select>
                                <select
                                    className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                >
                                    <option value="">All Types</option>
                                    <option value="blood">Blood Tests</option>
                                    <option value="urine">Urine Tests</option>
                                    <option value="stool">Stool Tests</option>
                                    <option value="tissue">Tissue Tests</option>
                                    <option value="culture">Culture</option>
                                    <option value="imaging">Imaging</option>
                                    <option value="molecular">Molecular</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="overflow-x-auto rounded-xl border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-lg font-semibold text-gray-700 uppercase tracking-wider">
                                                Test Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-lg font-semibold text-gray-700 uppercase tracking-wider">
                                                Code
                                            </th>
                                            <th className="px-6 py-3 text-left text-lg font-semibold text-gray-700 uppercase tracking-wider">
                                                Category
                                            </th>
                                            <th className="px-6 py-3 text-left text-lg font-semibold text-gray-700 uppercase tracking-wider">
                                                Base Price
                                            </th>
                                            <th className="px-6 py-3 text-left text-lg font-semibold text-gray-700 uppercase tracking-wider">
                                                Urgent (+50%)
                                            </th>
                                            <th className="px-6 py-3 text-left text-lg font-semibold text-gray-700 uppercase tracking-wider">
                                                STAT (+100%)
                                            </th>
                                            <th className="px-6 py-3 text-left text-lg font-semibold text-gray-700 uppercase tracking-wider">
                                                Turnaround
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredPrices.map((price) => (
                                            <tr key={price._id} className="hover:bg-blue-50 transition-colors duration-150">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <div className="font-medium text-gray-900">{price.testName}</div>
                                                        <div className="text-lg text-gray-500">{price.description}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-lg font-medium bg-blue-100 text-blue-800">
                                                        {price.testCode}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="capitalize text-lg text-gray-600">{price.category}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-lg font-bold text-gray-900">
                                                        ${price.basePrice.toFixed(2)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-lg font-semibold text-orange-600">
                                                        ${((price.urgentPrice || price.basePrice * 1.5)).toFixed(2)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-lg font-semibold text-red-600">
                                                        ${((price.statPrice || price.basePrice * 2)).toFixed(2)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-lg text-gray-600">{price.estimatedTime}</div>
                                                    {price.requiresFasting && (
                                                        <span className="inline-flex items-center px-2 py-1 rounded text-lg font-medium bg-yellow-100 text-yellow-800 mt-1">
                                                            Fasting Required
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
                            <button
                                onClick={() => setShowPriceList(false)}
                                className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Invoice Creation Modal */}
            {showInvoiceModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Create Invoice</h3>
                                <p className="text-lg text-gray-500">Review and create invoice for selected lab tests</p>
                            </div>
                            <button
                                onClick={() => setShowInvoiceModal(false)}
                                className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Patient & Appointment Info */}
                            <div className="bg-blue-50 rounded-xl p-4 mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-lg text-blue-700 font-medium">Patient</p>
                                        <p className="text-lg font-semibold text-blue-900">
                                            {patient?.userId?.firstName} {patient?.userId?.lastName}
                                        </p>
                                        <p className="text-lg text-blue-600">ID: {patient?.patientId}</p>
                                    </div>
                                    <div>
                                        <p className="text-lg text-blue-700 font-medium">Appointment</p>
                                        <p className="text-lg font-semibold text-blue-900">#{appointment.appointmentId}</p>
                                        <p className="text-lg text-blue-600">
                                            {new Date(appointment.appointmentDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Selected Tests */}
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-gray-700 mb-3">Selected Lab Tests</h4>
                                <div className="space-y-3">
                                    {labTests
                                        .filter(test => selectedTestsForBilling.includes(test._id))
                                        .map((test) => {
                                            const price = calculateTestPrice(test.testName, test.priority);
                                            return (
                                                <div key={test._id} className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{test.testName}</p>
                                                        <div className="flex items-center space-x-2 mt-1">
                                                            <span className={`text-lg px-2 py-1 rounded ${getTestStatusColor(test.status)}`}>
                                                                {test.status.replace('_', ' ')}
                                                            </span>
                                                            <span className={`text-lg px-2 py-1 rounded ${getPriorityColor(test.priority)}`}>
                                                                {test.priority}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-bold text-blue-600">${price.toFixed(2)}</p>
                                                        <p className="text-lg text-gray-500">Priority: {test.priority}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>

                            {/* Invoice Details Form */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-2">
                                        Discount (%)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={invoiceForm.discount}
                                        onChange={(e) => setInvoiceForm({
                                            ...invoiceForm,
                                            discount: parseFloat(e.target.value) || 0
                                        })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-2">
                                        Tax (%)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={invoiceForm.tax}
                                        onChange={(e) => setInvoiceForm({
                                            ...invoiceForm,
                                            tax: parseFloat(e.target.value) || 0
                                        })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-2">
                                        Payment Method
                                    </label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={invoiceForm.paymentMethod}
                                        onChange={(e) => setInvoiceForm({
                                            ...invoiceForm,
                                            paymentMethod: e.target.value
                                        })}
                                    >
                                        <option value="cash">Cash</option>
                                        <option value="credit_card">Credit Card</option>
                                        <option value="debit_card">Debit Card</option>
                                        <option value="insurance">Insurance</option>
                                        <option value="online">Online Payment</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-2">
                                        Due Date
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                                        readOnly
                                    />
                                </div>
                            </div>

                            {/* Insurance Information (Conditional) */}
                            {invoiceForm.paymentMethod === 'insurance' && (
                                <div className="bg-yellow-50 rounded-xl p-4 mb-6 border border-yellow-200">
                                    <h4 className="text-lg font-semibold text-yellow-800 mb-3">Insurance Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-lg font-medium text-yellow-700 mb-1">
                                                Insurance Provider
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                                value={invoiceForm.insuranceInfo.insuranceProvider}
                                                onChange={(e) => setInvoiceForm({
                                                    ...invoiceForm,
                                                    insuranceInfo: {
                                                        ...invoiceForm.insuranceInfo,
                                                        insuranceProvider: e.target.value
                                                    }
                                                })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-lg font-medium text-yellow-700 mb-1">
                                                Policy Number
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                                value={invoiceForm.insuranceInfo.policyNumber}
                                                onChange={(e) => setInvoiceForm({
                                                    ...invoiceForm,
                                                    insuranceInfo: {
                                                        ...invoiceForm.insuranceInfo,
                                                        policyNumber: e.target.value
                                                    }
                                                })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Invoice Summary */}
                            <div className="bg-gray-50 rounded-xl p-5 mb-6">
                                <h4 className="text-lg font-semibold text-gray-700 mb-4">Invoice Summary</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium">${calculateInvoiceTotals().subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tax ({invoiceForm.tax}%)</span>
                                        <span className="font-medium">${calculateInvoiceTotals().tax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Discount ({invoiceForm.discount}%)</span>
                                        <span className="font-medium text-green-600">-${calculateInvoiceTotals().discount.toFixed(2)}</span>
                                    </div>
                                    <div className="pt-3 border-t border-gray-200">
                                        <div className="flex justify-between">
                                            <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                                            <span className="text-2xl font-bold text-blue-600">
                                                ${calculateInvoiceTotals().total.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Notes */}
                            <div className="mb-6">
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Invoice Notes (Optional)
                                </label>
                                <textarea
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows="3"
                                    placeholder="Add any additional notes for this invoice..."
                                    value={invoiceForm.notes}
                                    onChange={(e) => setInvoiceForm({
                                        ...invoiceForm,
                                        notes: e.target.value
                                    })}
                                />
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-between items-center">
                            <button
                                onClick={() => setShowInvoiceModal(false)}
                                className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <div className="flex space-x-3">
                                <button
                                    onClick={handleCreateInvoice}
                                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm transition-all duration-200"
                                >
                                    <div className="flex items-center">
                                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                                        Create Invoice
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Lab Test Modal with Pricing */}
            {showLabModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Request Lab Tests</h3>
                                <p className="text-lg text-gray-500">Select tests from price list or enter custom tests</p>
                            </div>
                            <button
                                onClick={() => setShowLabModal(false)}
                                className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Price List Quick View */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="text-lg font-semibold text-gray-700">Quick Price Reference</h4>
                                    <button
                                        onClick={() => setShowPriceList(true)}
                                        className="text-lg text-blue-600 hover:text-blue-800 flex items-center"
                                    >
                                        <MagnifyingGlassIcon className="h-4 w-4 mr-1" />
                                        View Full Price List
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {labTestPrices.slice(0, 8).map((price) => (
                                        <div
                                            key={price._id}
                                            className="bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-lg p-3 cursor-pointer transition-colors duration-150"
                                            onClick={() => {
                                                const updatedTests = [...labTestForm.tests];
                                                updatedTests[0] = {
                                                    ...updatedTests[0],
                                                    testName: price.testName,
                                                    testCode: price.testCode,
                                                    testType: price.testType,
                                                    estimatedPrice: price.basePrice
                                                };
                                                setLabTestForm({ ...labTestForm, tests: updatedTests });
                                            }}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium text-gray-900 text-lg">{price.testName}</p>
                                                    <p className="text-lg text-gray-500">{price.testCode}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-blue-600">${price.basePrice}</p>
                                                    <p className="text-lg text-gray-500">Base</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Test Forms */}
                            {labTestForm.tests.map((test, index) => (
                                <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-5 mb-4 border border-blue-200">
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <h5 className="font-semibold text-gray-900">Test #{index + 1}</h5>
                                            {test.estimatedPrice > 0 && (
                                                <div className="flex items-center mt-1">
                                                    <CurrencyDollarIcon className="h-4 w-4 text-green-600 mr-1" />
                                                    <span className="text-lg font-bold text-green-600">
                                                        ${test.estimatedPrice.toFixed(2)}
                                                    </span>
                                                    <span className="text-lg text-gray-500 ml-2">
                                                        {test.priority === 'routine' ? '(Routine)' :
                                                            test.priority === 'urgent' ? '(Urgent +50%)' :
                                                                '(STAT +100%)'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        {labTestForm.tests.length > 1 && (
                                            <button
                                                onClick={() => handleRemoveTest(index)}
                                                className="text-red-600 hover:text-red-800 transition-colors duration-200"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-lg font-medium text-gray-700 mb-1">
                                                Test Name *
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    list={`testNames-${index}`}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    value={test.testName}
                                                    onChange={(e) => handleTestNameChange(index, e.target.value)}
                                                    placeholder="Select or type test name"
                                                />
                                                <datalist id={`testNames-${index}`}>
                                                    {labTestPrices.map(price => (
                                                        <option key={price._id} value={price.testName}>
                                                            {price.testCode} - ${price.basePrice}
                                                        </option>
                                                    ))}
                                                </datalist>
                                            </div>
                                            {test.testCode && (
                                                <p className="mt-1 text-lg text-blue-600">
                                                    Code: {test.testCode} • Type: {test.testType}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-lg font-medium text-gray-700 mb-1">
                                                Priority
                                            </label>
                                            <div className="flex space-x-2">
                                                {[
                                                    { value: 'routine', label: 'Routine', color: 'bg-green-100 text-green-800' },
                                                    { value: 'urgent', label: 'Urgent (+50%)', color: 'bg-orange-100 text-orange-800' },
                                                    { value: 'stat', label: 'STAT (+100%)', color: 'bg-red-100 text-red-800' }
                                                ].map((option) => (
                                                    <button
                                                        key={option.value}
                                                        type="button"
                                                        className={`flex-1 py-2 text-lg font-medium rounded-lg transition-all duration-200 ${test.priority === option.value
                                                            ? `${option.color} ring-2 ring-offset-1 ring-opacity-50`
                                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                            }`}
                                                        onClick={() => handleTestPriorityChange(index, option.value)}
                                                    >
                                                        {option.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-lg font-medium text-gray-700 mb-1">
                                                Specimen Type
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                value={test.specimenType}
                                                onChange={(e) => handleTestChange(index, 'specimenType', e.target.value)}
                                                placeholder="e.g., Blood, Urine, Tissue"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-lg font-medium text-gray-700 mb-1">
                                                Assign Lab Technician(s)
                                            </label>
                                            <select
                                                multiple
                                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                                                value={test.labTechnicianIds || []}
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
                                            <p className="mt-1 text-lg text-gray-500">
                                                {test.labTechnicianIds?.length || 0} technician(s) selected
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-lg font-medium text-gray-700 mb-1">
                                            Specimen Details
                                        </label>
                                        <textarea
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            rows="2"
                                            value={test.specimenDetails}
                                            onChange={(e) => handleTestChange(index, 'specimenDetails', e.target.value)}
                                            placeholder="Additional details about the specimen"
                                        />
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-lg font-medium text-gray-700 mb-1">
                                            Notes
                                        </label>
                                        <textarea
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            rows="2"
                                            value={test.notes}
                                            onChange={(e) => handleTestChange(index, 'notes', e.target.value)}
                                            placeholder="Special instructions or notes"
                                        />
                                    </div>
                                </div>
                            ))}

                            {/* Total Cost Summary */}
                            {labTestForm.tests.some(t => t.estimatedPrice > 0) && (
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 mb-6 border border-green-200">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900">Total Cost Summary</h4>
                                            <p className="text-lg text-gray-600">
                                                {labTestForm.tests.filter(t => t.testName.trim()).length} tests selected
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-3xl font-bold text-green-600">
                                                ${labTestForm.tests.reduce((sum, test) => sum + test.estimatedPrice, 0).toFixed(2)}
                                            </p>
                                            <p className="text-lg text-gray-500">Estimated total cost</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-between items-center">
                            <div>
                                <button
                                    onClick={handleAddTest}
                                    className="inline-flex items-center px-4 py-2 text-lg text-blue-600 hover:text-blue-800"
                                >
                                    <PlusIcon className="h-4 w-4 mr-1" />
                                    Add Another Test
                                </button>
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowLabModal(false)}
                                    className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateLabTest}
                                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-sm transition-all duration-200"
                                >
                                    <div className="flex items-center">
                                        <BeakerIcon className="h-5 w-5 mr-2" />
                                        Request {labTestForm.tests.length} Test{labTestForm.tests.length > 1 ? 's' : ''}
                                        {labTestForm.tests.some(t => t.estimatedPrice > 0) && (
                                            <span className="ml-2 bg-white/20 px-2 py-0.5 rounded text-lg">
                                                ${labTestForm.tests.reduce((sum, test) => sum + test.estimatedPrice, 0).toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Prescription Modal */}
            {showPrescriptionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">Create Prescription</h3>
                            <button
                                onClick={() => setShowPrescriptionModal(false)}
                                className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-6">
                            <h4 className="text-lg font-medium text-gray-900 mb-3">Medications</h4>
                            {prescriptionForm.medications.map((med, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-200">
                                    <div className="flex justify-between items-center mb-3">
                                        <h5 className="font-medium text-gray-900">Medication #{index + 1}</h5>
                                        {prescriptionForm.medications.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const updatedMedications = prescriptionForm.medications.filter((_, i) => i !== index);
                                                    setPrescriptionForm({ ...prescriptionForm, medications: updatedMedications });
                                                }}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-lg font-medium text-gray-700 mb-1">
                                            Medicine Name *
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                                value={med.medicineName}
                                                onChange={(e) => {
                                                    handleMedicationChange(index, 'medicineName', e.target.value);
                                                    handleMedicineSearch(index, e.target.value);
                                                }}
                                                placeholder="Search medicine from inventory..."
                                                onFocus={() => setShowMedicineSearchIndex(index)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowMedicineSearchIndex(index)}
                                                className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                                            >
                                                <MagnifyingGlassIcon className="h-5 w-5" />
                                            </button>

                                            {showMedicineSearchIndex === index && (
                                                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                    {filteredMedicines.map(medicine => (
                                                        <div
                                                            key={medicine._id}
                                                            className="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100"
                                                            onClick={() => {
                                                                handleMedicationChange(index, 'medicineName', medicine.medicineName);
                                                                handleMedicationChange(index, 'medicineId', medicine.medicineId);
                                                                handleMedicationChange(index, 'unitPrice', medicine.unitPrice);
                                                                handleMedicationChange(index, 'genericName', medicine.genericName);
                                                                closeMedicineSearch();
                                                            }}
                                                        >
                                                            <div className="font-medium text-gray-900">{medicine.medicineName}</div>
                                                            <div className="text-lg text-gray-500">
                                                                {medicine.genericName} • ${medicine.unitPrice} • Stock: {medicine.quantity}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {filteredMedicines.length === 0 && (
                                                        <div className="px-3 py-2 text-gray-500 text-center">No medicines found</div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <label className="block text-lg font-medium text-gray-700 mb-1">
                                                Generic Name
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                                value={med.genericName || ''}
                                                onChange={(e) => handleMedicationChange(index, 'genericName', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-lg font-medium text-gray-700 mb-1">
                                                Unit Price
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                                value={med.unitPrice || ''}
                                                onChange={(e) => handleMedicationChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-lg font-medium text-gray-700 mb-1">
                                                Dosage *
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                                value={med.dosage || ''}
                                                onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                                                placeholder="e.g., 500mg, 1 tablet"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-lg font-medium text-gray-700 mb-1">
                                                Frequency *
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                                value={med.frequency || ''}
                                                onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                                                placeholder="e.g., Twice daily, Every 8 hours"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-lg font-medium text-gray-700 mb-1">
                                                Duration *
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                                value={med.duration || ''}
                                                onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                                                placeholder="e.g., 7 days, 2 weeks"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-lg font-medium text-gray-700 mb-1">
                                                Quantity *
                                            </label>
                                            <input
                                                type="number"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                                value={med.quantity || ''}
                                                onChange={(e) => handleMedicationChange(index, 'quantity', parseInt(e.target.value) || 1)}
                                                placeholder="e.g., 30"
                                                min="1"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-lg font-medium text-gray-700 mb-1">
                                            Instructions
                                        </label>
                                        <textarea
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                            rows="2"
                                            value={med.instructions || ''}
                                            onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                                            placeholder="Special instructions for taking the medicine"
                                        />
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-lg font-medium text-gray-700 mb-1">
                                            Refills
                                        </label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                            value={med.refills || 0}
                                            onChange={(e) => handleMedicationChange(index, 'refills', parseInt(e.target.value) || 0)}
                                            min="0"
                                        />
                                    </div>
                                </div>
                            ))}

                            <button
                                onClick={handleAddMedication}
                                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:text-gray-800 hover:border-gray-400 mb-6 transition-all duration-200"
                            >
                                <PlusIcon className="h-5 w-5 inline-block mr-2" />
                                Add Another Medication
                            </button>

                            <div className="mb-6">
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Diagnosis
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    value={prescriptionForm.diagnosis.join(', ')}
                                    onChange={(e) => setPrescriptionForm({
                                        ...prescriptionForm,
                                        diagnosis: e.target.value.split(',').map(d => d.trim())
                                    })}
                                    placeholder="Enter diagnosis separated by commas"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Notes
                                </label>
                                <textarea
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    rows="3"
                                    value={prescriptionForm.notes}
                                    onChange={(e) => setPrescriptionForm({ ...prescriptionForm, notes: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Valid Until
                                </label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    value={prescriptionForm.validUntil}
                                    onChange={(e) => setPrescriptionForm({ ...prescriptionForm, validUntil: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowPrescriptionModal(false)}
                                className="px-6 py-2 border border-gray-300 text-lg font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreatePrescription}
                                className="px-6 py-2 border border-transparent text-lg font-medium rounded-xl text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm transition-all duration-200"
                            >
                                Create Prescription
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Status Update Modal */}
            {showStatusModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">Update Appointment Status</h3>
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="mb-4">
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Consultation Notes
                                </label>
                                <textarea
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    rows="3"
                                    value={statusForm.consultationNotes}
                                    onChange={(e) => setStatusForm({ ...statusForm, consultationNotes: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Follow-up Date
                                </label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    value={statusForm.followUpDate}
                                    onChange={(e) => setStatusForm({ ...statusForm, followUpDate: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="px-6 py-2 border border-gray-300 text-lg font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateStatus}
                                className="px-6 py-2 border border-transparent text-lg font-medium rounded-xl text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
                            >
                                Update Status
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Lab Test Results Modal */}
            {showLabResultsModal && selectedLabTest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{selectedLabTest.testName} - Full Report</h3>
                                <p className="text-lg text-gray-500">Test ID: {selectedLabTest.testId}</p>
                            </div>
                            <button
                                onClick={() => setShowLabResultsModal(false)}
                                className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-6">
                            {/* Header Info */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-blue-50 rounded-xl p-4">
                                    <h4 className="text-lg font-medium text-blue-700 mb-3">Patient Information</h4>
                                    <div className="space-y-2">
                                        <p className="text-lg">
                                            <span className="text-blue-600">Name: </span>
                                            <span className="font-medium">
                                                {selectedLabTest.patientId?.userId?.firstName} {selectedLabTest.patientId?.userId?.lastName}
                                            </span>
                                        </p>
                                        <p className="text-lg">
                                            <span className="text-blue-600">Patient ID: </span>
                                            <span className="font-medium">{selectedLabTest.patientId?.patientId}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-green-50 rounded-xl p-4">
                                    <h4 className="text-lg font-medium text-green-700 mb-3">Test Information</h4>
                                    <div className="space-y-2">
                                        <p className="text-lg">
                                            <span className="text-green-600">Test Type: </span>
                                            <span className="font-medium capitalize">{selectedLabTest.testType}</span>
                                        </p>
                                        <p className="text-lg">
                                            <span className="text-green-600">Specimen: </span>
                                            <span className="font-medium">{selectedLabTest.specimenType || 'N/A'}</span>
                                        </p>
                                        <p className="text-lg">
                                            <span className="text-green-600">Priority: </span>
                                            <span className={`font-medium px-2 py-0.5 rounded-full text-lg ${getPriorityColor(selectedLabTest.priority)}`}>
                                                {selectedLabTest.priority.toUpperCase()}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-purple-50 rounded-xl p-4">
                                    <h4 className="text-lg font-medium text-purple-700 mb-3">Timeline</h4>
                                    <div className="space-y-2">
                                        <p className="text-lg">
                                            <span className="text-purple-600">Requested: </span>
                                            <span className="font-medium">
                                                {new Date(selectedLabTest.requestedDate).toLocaleDateString()}
                                            </span>
                                        </p>
                                        {selectedLabTest.collectionDate && (
                                            <p className="text-lg">
                                                <span className="text-purple-600">Collected: </span>
                                                <span className="font-medium">
                                                    {new Date(selectedLabTest.collectionDate).toLocaleDateString()}
                                                </span>
                                            </p>
                                        )}
                                        {selectedLabTest.resultDate && (
                                            <p className="text-lg">
                                                <span className="text-purple-600">Completed: </span>
                                                <span className="font-medium">
                                                    {new Date(selectedLabTest.resultDate).toLocaleDateString()}
                                                </span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Test Results Section */}
                            {selectedLabTest.testParameters && selectedLabTest.testParameters.length > 0 && (
                                <div className="mb-8">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Test Results</h4>
                                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                                                        Parameter
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                                                        Value
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                                                        Unit
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                                                        Normal Range
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                                                        Interpretation
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {selectedLabTest.testParameters.map((param, index) => {
                                                    const isNormal = param.value === param.normalRange ||
                                                        param.value.includes('-') ||
                                                        param.normalRange.includes('-');
                                                    return (
                                                        <tr key={index} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4 text-lg font-medium text-gray-900">
                                                                {param.parameter}
                                                            </td>
                                                            <td className="px-6 py-4 text-lg font-semibold text-gray-900">
                                                                {param.value}
                                                            </td>
                                                            <td className="px-6 py-4 text-lg text-gray-500">
                                                                {param.unit}
                                                            </td>
                                                            <td className="px-6 py-4 text-lg text-gray-500">
                                                                {param.normalRange}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-lg font-medium ${isNormal ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                                    {isNormal ? 'Normal' : 'Abnormal'}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Result Notes */}
                            {selectedLabTest.resultNotes && (
                                <div className="mb-8">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Result Notes</h4>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-lg text-gray-600">{selectedLabTest.resultNotes}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
                            <button
                                onClick={() => setShowLabResultsModal(false)}
                                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
                            >
                                Close Report
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notifications */}
            {success && (
                <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
                    <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg shadow-lg">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <CheckCircleIcon className="h-5 w-5 text-green-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-lg text-green-700">{success}</p>
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
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg shadow-lg">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-lg text-red-700">{error}</p>
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