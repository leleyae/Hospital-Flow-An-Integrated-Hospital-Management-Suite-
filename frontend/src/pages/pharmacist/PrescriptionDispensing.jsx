import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../config/api';
import {
    MagnifyingGlassIcon,
    EyeIcon,
    ShoppingCartIcon,
    CheckCircleIcon,
    ClockIcon,
    UserIcon,
<<<<<<< HEAD
    CurrencyDollarIcon,
    XMarkIcon
=======
    CurrencyDollarIcon
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
} from '@heroicons/react/24/outline';

const PrescriptionDispensing = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showDispenseModal, setShowDispenseModal] = useState(false);
    const [dispenseForm, setDispenseForm] = useState({
        medications: [],
        paymentMethod: 'cash',
        discount: 0,
        notes: '',
        transactionId: ''
    });
<<<<<<< HEAD
    const [dispensing, setDispensing] = useState(false);
=======
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    const fetchPrescriptions = async () => {
        try {
            setLoading(true);
            const response = await api.get('/pharmacy/prescriptions');
            setPrescriptions(response.data.data);
        } catch (error) {
            console.error('Error fetching prescriptions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = async (prescriptionId) => {
        try {
            const response = await api.get(`/pharmacy/prescriptions/${prescriptionId}`);
<<<<<<< HEAD
            const prescription = response.data.data;

            // Ensure medications have proper stock info
            const updatedMedications = prescription.medications.map(med => ({
                ...med,
                stockInfo: med.stockInfo || null,
                available: med.stockInfo ? med.stockInfo.quantity >= med.quantity : false,
                unitPrice: med.stockInfo?.unitPrice || 0,
                totalPrice: (med.stockInfo?.unitPrice || 0) * med.quantity
            }));

            setSelectedPrescription({
                ...prescription,
                medications: updatedMedications
            });
            setShowDetailsModal(true);
        } catch (error) {
            console.error('Error fetching prescription details:', error);
            alert('Failed to load prescription details');
        }
    };

    const handleDispense = async (prescription) => {
        try {
            // First, get fresh prescription details
            const response = await api.get(`/pharmacy/prescriptions/${prescription._id}`);
            const freshPrescription = response.data.data;

            setSelectedPrescription(freshPrescription);

            // Initialize dispense form with prescription medications
            const medications = freshPrescription.medications.map(med => ({
                _id: med._id,
                medicineName: med.medicineName,
                medicineId: med.stockInfo?.medicineId || med.medicineId || '',
                unitPrice: med.stockInfo?.unitPrice || med.unitPrice || 0,
                prescribedQuantity: med.quantity,
                dispensedQuantity: med.quantity, // Default to prescribed quantity
                isAvailable: med.available || false
            })).filter(med => med.medicineId); // Only include medications with medicineId

            setDispenseForm({
                medications,
                paymentMethod: 'cash',
                discount: 0,
                notes: '',
                transactionId: ''
            });
            setShowDispenseModal(true);
        } catch (error) {
            console.error('Error preparing dispense:', error);
            alert('Failed to prepare prescription for dispensing');
        }
    };


    const handleDispenseSubmit = async () => {
        try {
            setDispensing(true);
            // const response = await api.post(`/pharmacy/prescriptions/${selectedPrescription._id}/dispense`, dispenseForm);

            // if (response.data.success) {
            alert('dispensed Sucsusfully');
            setShowDispenseModal(false);
            fetchPrescriptions();
            // } else {
            //     alert('Failed to dispense: ' + response.data.message);
            // }
        } catch (error) {
            console.error('Error dispensing prescription:', error);
            alert('Error dispensing prescription: ' + (error.response?.data?.message || error.message));
        } finally {
            setDispensing(false);
=======
            setSelectedPrescription(response.data.data);
            setShowDetailsModal(true);
        } catch (error) {
            console.error('Error fetching prescription details:', error);
        }
    };

    const handleDispense = (prescription) => {
        setSelectedPrescription(prescription);

        // Initialize dispense form with prescription medications
        const medications = prescription.medications.map(med => ({
            _id: med._id,
            medicineName: med.medicineName,
            prescribedQuantity: med.quantity,
            dispensedQuantity: med.quantity,
            medicineId: med.stockInfo?.medicineId || '',
            unitPrice: med.stockInfo?.unitPrice || 0
        }));

        setDispenseForm({
            medications,
            paymentMethod: 'cash',
            discount: 0,
            notes: '',
            transactionId: ''
        });
        setShowDispenseModal(true);
    };

    const handleDispenseSubmit = async () => {
        try {
            await api.post(`/pharmacy/prescriptions/${selectedPrescription._id}/dispense`, dispenseForm);
            setShowDispenseModal(false);
            fetchPrescriptions();
        } catch (error) {
            console.error('Error dispensing prescription:', error);
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            active: { color: 'bg-green-100 text-green-800', label: 'Active' },
            pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
            completed: { color: 'bg-blue-100 text-blue-800', label: 'Completed' },
            cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' }
        };
        return badges[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-4 text-gray-600">Loading prescriptions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Prescription Dispensing</h1>
                    <p className="text-gray-600 mt-2">Process and dispense patient prescriptions</p>
                </div>

                {/* Prescriptions List */}
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">
                            Prescriptions Ready for Dispensing ({prescriptions.length})
                        </h3>
                    </div>
                    <div className="p-6">
                        {prescriptions.length > 0 ? (
                            <div className="space-y-4">
                                {prescriptions.map((prescription) => {
                                    const status = getStatusBadge(prescription.status);
                                    const totalMedications = prescription.medications.length;
                                    const unavailableMeds = prescription.medications.filter(med => !med.stockInfo || med.stockInfo.quantity < med.quantity).length;

                                    return (
                                        <div key={prescription._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors duration-200">
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <h4 className="font-medium text-gray-900">
                                                        Prescription #{prescription.prescriptionId}
                                                    </h4>
                                                    <div className="flex items-center space-x-4 mt-1">
<<<<<<< HEAD
                                                        <div className="flex items-center text-lg text-gray-500">
                                                            <UserIcon className="h-4 w-4 mr-1" />
                                                            {prescription.patientId?.userId?.firstName} {prescription.patientId?.userId?.lastName}
                                                        </div>
                                                        <div className="flex items-center text-lg text-gray-500">
=======
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <UserIcon className="h-4 w-4 mr-1" />
                                                            {prescription.patientId?.userId?.firstName} {prescription.patientId?.userId?.lastName}
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-500">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                            <ClockIcon className="h-4 w-4 mr-1" />
                                                            {new Date(prescription.date).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
<<<<<<< HEAD
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-lg font-medium ${status.color}`}>
                                                        {status.label}
                                                    </span>
                                                    <div className="text-lg text-gray-500">
=======
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                                                        {status.label}
                                                    </span>
                                                    <div className="text-sm text-gray-500">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                        {totalMedications} meds
                                                        {unavailableMeds > 0 && (
                                                            <span className="ml-2 text-yellow-600">
                                                                ({unavailableMeds} unavailable)
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
<<<<<<< HEAD
                                                    <p className="text-lg text-gray-600 mb-1">
                                                        Doctor: Dr. {prescription.doctorId?.userId?.firstName} {prescription.doctorId?.userId?.lastName}
                                                    </p>
                                                    {prescription.diagnosis && prescription.diagnosis.length > 0 && (
                                                        <p className="text-lg text-gray-600">
=======
                                                    <p className="text-sm text-gray-600 mb-1">
                                                        Doctor: Dr. {prescription.doctorId?.userId?.firstName} {prescription.doctorId?.userId?.lastName}
                                                    </p>
                                                    {prescription.diagnosis && prescription.diagnosis.length > 0 && (
                                                        <p className="text-sm text-gray-600">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                            Diagnosis: {prescription.diagnosis.join(', ')}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleViewDetails(prescription._id)}
<<<<<<< HEAD
                                                        className="inline-flex items-center px-3 py-1 text-lg text-blue-600 hover:text-blue-800"
=======
                                                        className="inline-flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                    >
                                                        <EyeIcon className="h-4 w-4 mr-1" />
                                                        View Details
                                                    </button>
                                                    <button
                                                        onClick={() => handleDispense(prescription)}
<<<<<<< HEAD
                                                        className={`inline-flex items-center px-3 py-1 text-lg rounded-lg bg-blue-600 text-white hover:bg-blue-700
=======
                                                        disabled={unavailableMeds > 0}
                                                        className={`inline-flex items-center px-3 py-1 text-sm rounded-lg ${unavailableMeds > 0
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                            : 'bg-blue-600 text-white hover:bg-blue-700'
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                            }`}
                                                    >
                                                        <ShoppingCartIcon className="h-4 w-4 mr-1" />
                                                        Dispense
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <CheckCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-500">No prescriptions ready for dispensing</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Details Modal */}
            {showDetailsModal && selectedPrescription && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900">
                                Prescription Details - #{selectedPrescription.prescriptionId}
                            </h3>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-6">
                            {/* Patient Info */}
                            <div className="mb-6">
<<<<<<< HEAD
                                <h4 className="text-lg font-medium text-gray-700 mb-2">Patient Information</h4>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-lg text-gray-500">Name</p>
                                            <p className="text-lg text-gray-900">
=======
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Patient Information</h4>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500">Name</p>
                                            <p className="text-sm text-gray-900">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                {selectedPrescription.patientId?.userId?.firstName} {selectedPrescription.patientId?.userId?.lastName}
                                            </p>
                                        </div>
                                        <div>
<<<<<<< HEAD
                                            <p className="text-lg text-gray-500">Patient ID</p>
                                            <p className="text-lg text-gray-900">
=======
                                            <p className="text-xs text-gray-500">Patient ID</p>
                                            <p className="text-sm text-gray-900">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                {selectedPrescription.patientId?.patientId}
                                            </p>
                                        </div>
                                        <div>
<<<<<<< HEAD
                                            <p className="text-lg text-gray-500">Phone</p>
                                            <p className="text-lg text-gray-900">
=======
                                            <p className="text-xs text-gray-500">Phone</p>
                                            <p className="text-sm text-gray-900">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                {selectedPrescription.patientId?.userId?.phoneNumber}
                                            </p>
                                        </div>
                                        <div>
<<<<<<< HEAD
                                            <p className="text-lg text-gray-500">Email</p>
                                            <p className="text-lg text-gray-900">
=======
                                            <p className="text-xs text-gray-500">Email</p>
                                            <p className="text-sm text-gray-900">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                {selectedPrescription.patientId?.userId?.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Medications */}
                            <div>
<<<<<<< HEAD
                                <h4 className="text-lg font-medium text-gray-700 mb-2">Medications</h4>
=======
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Medications</h4>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                <div className="space-y-3">
                                    {selectedPrescription.medications.map((med, index) => {
                                        const hasStock = med.stockInfo && med.stockInfo.quantity >= med.quantity;

                                        return (
                                            <div key={index} className={`p-4 rounded-lg border ${hasStock ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                                                }`}>
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h5 className="font-medium text-gray-900">{med.medicineName}</h5>
                                                        {med.genericName && (
<<<<<<< HEAD
                                                            <p className="text-lg text-gray-600">Generic: {med.genericName}</p>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg text-gray-900">
                                                            {med.quantity} × {med.dosage}
                                                        </p>
                                                        <p className="text-lg text-gray-600">{med.frequency} for {med.duration}</p>
=======
                                                            <p className="text-sm text-gray-600">Generic: {med.genericName}</p>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm text-gray-900">
                                                            {med.quantity} × {med.dosage}
                                                        </p>
                                                        <p className="text-sm text-gray-600">{med.frequency} for {med.duration}</p>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                    </div>
                                                </div>

                                                {med.stockInfo ? (
                                                    <div className="mt-2 pt-2 border-t border-gray-200">
<<<<<<< HEAD
                                                        <div className="flex items-center justify-between text-lg">
                                                            <div className="flex items-center">
                                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-lg font-medium ${hasStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
=======
                                                        <div className="flex items-center justify-between text-sm">
                                                            <div className="flex items-center">
                                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${hasStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                                    }`}>
                                                                    {hasStock ? 'In Stock' : 'Low Stock'}
                                                                </span>
                                                                <span className="ml-2 text-gray-600">
                                                                    Available: {med.stockInfo.quantity} {med.stockInfo.unit}
                                                                </span>
                                                            </div>
                                                            <div className="text-gray-900">
                                                                Price: ${med.stockInfo.unitPrice?.toFixed(2) || '0.00'}
                                                            </div>
                                                        </div>
                                                        {!hasStock && (
<<<<<<< HEAD
                                                            <p className="mt-1 text-lg text-red-600">
=======
                                                            <p className="mt-1 text-sm text-red-600">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                                Insufficient stock. Need {med.quantity}, have {med.stockInfo.quantity}
                                                            </p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="mt-2 pt-2 border-t border-gray-200">
<<<<<<< HEAD
                                                        <p className="text-lg text-yellow-600">
=======
                                                        <p className="text-sm text-yellow-600">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                            No stock information available
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Diagnosis & Notes */}
                            {selectedPrescription.diagnosis && selectedPrescription.diagnosis.length > 0 && (
                                <div className="mt-6">
<<<<<<< HEAD
                                    <h4 className="text-lg font-medium text-gray-700 mb-2">Diagnosis</h4>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-lg text-gray-900">
=======
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Diagnosis</h4>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-sm text-gray-900">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                            {selectedPrescription.diagnosis.join(', ')}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {selectedPrescription.notes && (
                                <div className="mt-6">
<<<<<<< HEAD
                                    <h4 className="text-lg font-medium text-gray-700 mb-2">Doctor's Notes</h4>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-lg text-gray-900">{selectedPrescription.notes}</p>
=======
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Doctor's Notes</h4>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-sm text-gray-900">{selectedPrescription.notes}</p>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
                            <button
                                onClick={() => setShowDetailsModal(false)}
<<<<<<< HEAD
                                className="px-4 py-2 border border-gray-300 text-lg font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
=======
                                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Dispense Modal */}
            {showDispenseModal && selectedPrescription && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900">
                                Dispense Prescription - #{selectedPrescription.prescriptionId}
                            </h3>
                            <button
                                onClick={() => setShowDispenseModal(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-6">
                            {/* Medications to Dispense */}
                            <div className="mb-6">
<<<<<<< HEAD
                                <h4 className="text-lg font-medium text-gray-700 mb-3">Medications</h4>
                                <div className="space-y-4">
                                    {dispenseForm.medications.map((med, index) => {
                                        const originalMed = selectedPrescription.medications.find(m => m._id === med._id);
                                        const stockInfo = originalMed?.stockInfo;
                                        const maxQuantity = Math.min(
                                            med.prescribedQuantity,
                                            stockInfo?.quantity || 0
                                        );

                                        return (
                                            <div key={index} className={`bg-gray-50 p-4 rounded-lg ${stockInfo?.quantity >= med.dispensedQuantity ? 'border-green-200' : 'border-red-200'}`}>
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h5 className="font-medium text-gray-900">{med.medicineName}</h5>
                                                        <p className="text-lg text-gray-600">
                                                            Prescribed: {med.prescribedQuantity} |
                                                            Available: {stockInfo?.quantity || 0} |
                                                            Price: ${med.unitPrice?.toFixed(2) || '0.00'} each
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-medium text-gray-900">
                                                            ${((med.unitPrice || 0) * med.dispensedQuantity).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <div>
                                                        <label className="block text-lg font-medium text-gray-700 mb-1">
                                                            Dispensed Quantity
                                                        </label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max={maxQuantity}
                                                            className={`w-24 px-3 py-1 border rounded-lg ${stockInfo?.quantity >= med.dispensedQuantity ? 'border-gray-300' : 'border-red-300'}`}
                                                            value={med.dispensedQuantity}
                                                            onChange={(e) => {
                                                                const updatedMeds = [...dispenseForm.medications];
                                                                const value = Math.max(0, Math.min(maxQuantity, parseInt(e.target.value) || 0));
                                                                updatedMeds[index].dispensedQuantity = value;
                                                                setDispenseForm({ ...dispenseForm, medications: updatedMeds });
                                                            }}
                                                        />
                                                    </div>
                                                    {med.dispensedQuantity < med.prescribedQuantity && (
                                                        <p className="text-lg text-yellow-600">
                                                            Partial: {med.dispensedQuantity}/{med.prescribedQuantity}
                                                        </p>
                                                    )}
                                                    {stockInfo?.quantity < med.dispensedQuantity && (
                                                        <p className="text-lg text-red-600">
                                                            Only {stockInfo.quantity} available!
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
=======
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Medications</h4>
                                <div className="space-y-4">
                                    {dispenseForm.medications.map((med, index) => (
                                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h5 className="font-medium text-gray-900">{med.medicineName}</h5>
                                                    <p className="text-sm text-gray-600">
                                                        Prescribed: {med.prescribedQuantity} | Available: {selectedPrescription.medications[index]?.stockInfo?.quantity || 0}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-900">
                                                        ${med.unitPrice?.toFixed(2)} each
                                                    </p>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        Total: ${(med.unitPrice * med.dispensedQuantity).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        Dispensed Quantity
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max={med.prescribedQuantity}
                                                        className="w-24 px-3 py-1 border border-gray-300 rounded-lg"
                                                        value={med.dispensedQuantity}
                                                        onChange={(e) => {
                                                            const updatedMeds = [...dispenseForm.medications];
                                                            updatedMeds[index].dispensedQuantity = parseInt(e.target.value) || 0;
                                                            setDispenseForm({ ...dispenseForm, medications: updatedMeds });
                                                        }}
                                                    />
                                                </div>
                                                {med.dispensedQuantity < med.prescribedQuantity && (
                                                    <p className="text-sm text-yellow-600">
                                                        Partial dispense: {med.dispensedQuantity}/{med.prescribedQuantity}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                </div>
                            </div>

                            {/* Payment Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
<<<<<<< HEAD
                                    <h4 className="text-lg font-medium text-gray-700 mb-3">Payment Information</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-lg font-medium text-gray-700 mb-1">
=======
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">Payment Information</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                Payment Method
                                            </label>
                                            <select
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                value={dispenseForm.paymentMethod}
                                                onChange={(e) => setDispenseForm({ ...dispenseForm, paymentMethod: e.target.value })}
                                            >
                                                <option value="cash">Cash</option>
<<<<<<< HEAD
                                                <option value="credit_card">Credit Card</option>
                                                <option value="debit_card">Debit Card</option>
=======
                                                <option value="card">Credit/Debit Card</option>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                <option value="insurance">Insurance</option>
                                                <option value="cash_on_delivery">Cash on Delivery</option>
                                            </select>
                                        </div>
                                        <div>
<<<<<<< HEAD
                                            <label className="block text-lg font-medium text-gray-700 mb-1">
=======
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                Discount ($)
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                value={dispenseForm.discount}
                                                onChange={(e) => setDispenseForm({ ...dispenseForm, discount: parseFloat(e.target.value) || 0 })}
                                            />
                                        </div>
                                        <div>
<<<<<<< HEAD
                                            <label className="block text-lg font-medium text-gray-700 mb-1">
=======
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                Transaction ID (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                value={dispenseForm.transactionId}
                                                onChange={(e) => setDispenseForm({ ...dispenseForm, transactionId: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Summary */}
                                <div>
<<<<<<< HEAD
                                    <h4 className="text-lg font-medium text-gray-700 mb-3">Summary</h4>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-lg">
=======
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">Summary</h4>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                <span className="text-gray-600">Subtotal</span>
                                                <span className="text-gray-900">
                                                    ${dispenseForm.medications.reduce((sum, med) => sum + (med.unitPrice * med.dispensedQuantity), 0).toFixed(2)}
                                                </span>
                                            </div>
<<<<<<< HEAD
                                            <div className="flex justify-between text-lg">
=======
                                            <div className="flex justify-between text-sm">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                <span className="text-gray-600">Discount</span>
                                                <span className="text-red-600">-${dispenseForm.discount.toFixed(2)}</span>
                                            </div>
                                            <div className="border-t border-gray-200 pt-2 mt-2">
                                                <div className="flex justify-between font-medium">
                                                    <span className="text-gray-900">Total</span>
                                                    <span className="text-lg text-blue-600">
                                                        ${(
                                                            dispenseForm.medications.reduce((sum, med) => sum + (med.unitPrice * med.dispensedQuantity), 0) -
                                                            dispenseForm.discount
                                                        ).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4">
<<<<<<< HEAD
                                        <label className="block text-lg font-medium text-gray-700 mb-1">
=======
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                            Notes (Optional)
                                        </label>
                                        <textarea
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            rows="3"
                                            value={dispenseForm.notes}
                                            onChange={(e) => setDispenseForm({ ...dispenseForm, notes: e.target.value })}
                                            placeholder="Additional notes for this dispense..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
<<<<<<< HEAD
                            <div className="text-lg text-gray-600">
=======
                            <div className="text-sm text-gray-600">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                Patient: {selectedPrescription.patientId?.userId?.firstName} {selectedPrescription.patientId?.userId?.lastName}
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowDispenseModal(false)}
<<<<<<< HEAD
                                    className="px-4 py-2 border border-gray-300 text-lg font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
=======
                                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDispenseSubmit}
<<<<<<< HEAD
                                    disabled={dispensing}
                                    className={`px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 ${dispensing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {dispensing ? (
                                        <>
                                            <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCartIcon className="h-4 w-4 inline mr-2" />
                                            Confirm & Dispense
                                        </>
                                    )}
=======
                                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                                >
                                    <ShoppingCartIcon className="h-4 w-4 inline mr-2" />
                                    Confirm & Dispense
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PrescriptionDispensing;