// src/pages/pharmacist/Prescriptions.jsx
import { useState, useEffect } from 'react';
import {
    FaSearch,
    FaEye,
    FaCheckCircle,

    FaUserMd,
    FaUser,
    FaCalendar,

} from 'react-icons/fa';
import { pharmacistService } from '../../services/pharmacist.service';

const Prescriptions = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('active');
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [showDispenseModal, setShowDispenseModal] = useState(false);
    const [dispenseData, setDispenseData] = useState({ medicationId: '', quantityDispensed: '' });

    useEffect(() => {
        loadPrescriptions();
    }, [statusFilter]);

    const loadPrescriptions = async () => {
        try {
            setLoading(true);
            const data = await pharmacistService.getAllPrescriptions({
                status: statusFilter,
                page: 1,
                limit: 20
            });
            setPrescriptions(data.data?.prescriptions || []);
        } catch (error) {
            console.error('Error loading prescriptions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDispense = async () => {
        if (!selectedPrescription) return;

        try {
            await pharmacistService.dispenseMedicine(
                selectedPrescription._id,
                dispenseData
            );
            setShowDispenseModal(false);
            loadPrescriptions();
            alert('Medication dispensed successfully!');
        } catch (error) {
            console.error('Error dispensing medication:', error);
            alert(error.response?.data?.message || 'Failed to dispense medication');
        }
    };

    const handleCheckStock = async (prescriptionId) => {
        try {
            const data = await pharmacistService.checkStockForPrescription(prescriptionId);
            alert(`Stock check complete. Available: ${data.data?.summary?.availableMedications} of ${data.data?.summary?.totalMedications}`);
        } catch (error) {
            console.error('Error checking stock:', error);
            alert('Failed to check stock');
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'active': { color: 'bg-green-100 text-green-800', icon: '✓' },
            'completed': { color: 'bg-blue-100 text-blue-800', icon: '✓' },
            'cancelled': { color: 'bg-red-100 text-red-800', icon: '✗' },
            'expired': { color: 'bg-gray-100 text-gray-800', icon: '⌛' },
            'pending': { color: 'bg-yellow-100 text-yellow-800', icon: '⏳' }
        };

        const config = statusConfig[status] || statusConfig['pending'];
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                {config.icon} {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Prescriptions</h1>
                <p className="text-gray-600">Manage and dispense patient prescriptions</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-1">Search</label>
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search prescriptions..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-1">Status</label>
                        <div className="flex space-x-2">
                            {['active', 'pending', 'completed', 'cancelled'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-3 py-2 rounded-lg text-lg font-medium ${statusFilter === status ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-1">Actions</label>
                        <button
                            onClick={loadPrescriptions}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            {/* Prescriptions List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : prescriptions.length === 0 ? (
                    <div className="text-center py-12">
                        <FaUserMd className="mx-auto text-gray-400 text-4xl mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No prescriptions found</h3>
                        <p className="text-gray-500">No prescriptions match your current filters.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Prescription
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Patient
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Doctor
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Medications
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {prescriptions.map((prescription) => (
                                    <tr key={prescription._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">#{prescription.prescriptionId}</div>
                                            {prescription.validUntil && (
                                                <div className="text-xs text-gray-500">
                                                    Valid until: {new Date(prescription.validUntil).toLocaleDateString()}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <FaUser className="text-gray-400 mr-2" />
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {prescription.patientId?.userId?.firstName} {prescription.patientId?.userId?.lastName}
                                                    </div>
                                                    <div className="text-lg text-gray-500">
                                                        ID: {prescription.patientId?.patientId || 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <FaUserMd className="text-gray-400 mr-2" />
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        Dr. {prescription.doctorId?.userId?.firstName} {prescription.doctorId?.userId?.lastName}
                                                    </div>
                                                    <div className="text-lg text-gray-500">
                                                        {prescription.doctorId?.specialization}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-lg text-gray-900">
                                                {prescription.medications?.length || 0} items
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {prescription.medications?.filter(m => m.isDispensed).length || 0} dispensed
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <FaCalendar className="text-gray-400 mr-2" />
                                                <div className="text-lg text-gray-900">
                                                    {new Date(prescription.date).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(prescription.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-lg font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedPrescription(prescription);
                                                        setShowDetails(true);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-900 px-2 py-1 bg-blue-50 rounded"
                                                >
                                                    <FaEye />
                                                </button>
                                                {prescription.status === 'active' && (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedPrescription(prescription);
                                                                setShowDispenseModal(true);
                                                            }}
                                                            className="text-green-600 hover:text-green-900 px-2 py-1 bg-green-50 rounded"
                                                        >
                                                            <FaCheckCircle />
                                                        </button>
                                                        <button
                                                            onClick={() => handleCheckStock(prescription._id)}
                                                            className="text-purple-600 hover:text-purple-900 px-2 py-1 bg-purple-50 rounded text-xs"
                                                        >
                                                            Check Stock
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Prescription Details Modal */}
            {showDetails && selectedPrescription && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900">
                                    Prescription #{selectedPrescription.prescriptionId}
                                </h3>
                                <button
                                    onClick={() => setShowDetails(false)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Patient and Doctor Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-blue-800 mb-2">Patient Information</h4>
                                    <p className="text-gray-700">
                                        {selectedPrescription.patientId?.userId?.firstName} {selectedPrescription.patientId?.userId?.lastName}
                                    </p>
                                    <p className="text-lg text-gray-600">
                                        ID: {selectedPrescription.patientId?.patientId || 'N/A'}
                                    </p>
                                </div>

                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-green-800 mb-2">Doctor Information</h4>
                                    <p className="text-gray-700">
                                        Dr. {selectedPrescription.doctorId?.userId?.firstName} {selectedPrescription.doctorId?.userId?.lastName}
                                    </p>
                                    <p className="text-lg text-gray-600">
                                        {selectedPrescription.doctorId?.specialization}
                                    </p>
                                </div>
                            </div>

                            {/* Medications List */}
                            <div className="mb-6">
                                <h4 className="font-medium text-gray-900 mb-3">Medications</h4>
                                <div className="space-y-3">
                                    {selectedPrescription.medications?.map((med, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h5 className="font-medium text-gray-900">{med.medicineName}</h5>
                                                    {med.genericName && (
                                                        <p className="text-lg text-gray-600">Generic: {med.genericName}</p>
                                                    )}
                                                </div>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${med.isDispensed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {med.isDispensed ? 'Dispensed' : 'Pending'}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-lg">
                                                <div>
                                                    <span className="text-gray-500">Dosage:</span>
                                                    <span className="ml-2 text-gray-900">{med.dosage}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Frequency:</span>
                                                    <span className="ml-2 text-gray-900">{med.frequency}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Duration:</span>
                                                    <span className="ml-2 text-gray-900">{med.duration}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Quantity:</span>
                                                    <span className="ml-2 text-gray-900">{med.quantity}</span>
                                                </div>
                                            </div>
                                            {med.instructions && (
                                                <p className="mt-2 text-lg text-gray-600">
                                                    <span className="font-medium">Instructions:</span> {med.instructions}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Diagnosis and Notes */}
                            {selectedPrescription.diagnosis?.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="font-medium text-gray-900 mb-2">Diagnosis</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedPrescription.diagnosis.map((diag, index) => (
                                            <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-lg">
                                                {diag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedPrescription.notes && (
                                <div className="mb-6">
                                    <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                                    <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedPrescription.notes}</p>
                                </div>
                            )}

                            <div className="flex justify-end">
                                <button
                                    onClick={() => setShowDetails(false)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Dispense Modal */}
            {showDispenseModal && selectedPrescription && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Dispense Medication</h3>
                                <button
                                    onClick={() => setShowDispenseModal(false)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    ✕
                                </button>
                            </div>

                            <p className="text-gray-600 mb-4">
                                Select medication to dispense from prescription #{selectedPrescription.prescriptionId}
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-1">
                                        Select Medication
                                    </label>
                                    <select
                                        value={dispenseData.medicationId}
                                        onChange={(e) => setDispenseData({ ...dispenseData, medicationId: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select medication...</option>
                                        {selectedPrescription.medications
                                            ?.filter(med => !med.isDispensed)
                                            .map((med, index) => (
                                                <option key={index} value={med._id}>
                                                    {med.medicineName} - {med.quantity} units
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-1">
                                        Quantity to Dispense
                                    </label>
                                    <input
                                        type="number"
                                        value={dispenseData.quantityDispensed}
                                        onChange={(e) => setDispenseData({ ...dispenseData, quantityDispensed: e.target.value })}
                                        placeholder="Enter quantity"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Leave empty to dispense full prescription quantity
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setShowDispenseModal(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDispense}
                                    disabled={!dispenseData.medicationId}
                                    className={`px-4 py-2 rounded-lg ${!dispenseData.medicationId ? 'bg-gray-300 text-gray-500' : 'bg-green-600 text-white hover:bg-green-700'}`}
                                >
                                    Dispense
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Prescriptions;