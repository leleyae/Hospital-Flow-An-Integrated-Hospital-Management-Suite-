// pages/lab-technician/AddTestResults.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../config/api';
import {
    ArrowLeftIcon,
    BeakerIcon,
    PlusIcon,
    TrashIcon,
    DocumentTextIcon,
    CalculatorIcon,
    DeviceTabletIcon,
    CalendarIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const AddTestResults = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [test, setTest] = useState(null);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        testParameters: [{
            parameter: '',
            value: '',
            unit: '',
            normalRange: '',
            isAbnormal: false,
            notes: ''
        }],
        resultNotes: '',
        equipmentUsed: '',
        equipmentId: '',
        equipmentCalibrationDate: '',
        resultDate: new Date().toISOString().split('T')[0],
        validationStatus: 'pending',
        validatorNotes: ''
    });

    useEffect(() => {
        fetchTestDetails();
    }, [id]);

    const fetchTestDetails = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/lab-technician/tests/${id}`);
            setTest(response.data.data);

            // If test already has parameters, pre-fill the form
            if (response.data.data.testParameters && response.data.data.testParameters.length > 0) {
                setFormData({
                    ...formData,
                    testParameters: response.data.data.testParameters,
                    resultNotes: response.data.data.resultNotes || '',
                    equipmentUsed: response.data.data.equipmentUsed || '',
                    equipmentId: response.data.data.equipmentId || '',
                    equipmentCalibrationDate: response.data.data.equipmentCalibrationDate
                        ? new Date(response.data.data.equipmentCalibrationDate).toISOString().split('T')[0]
                        : '',
                    resultDate: response.data.data.resultDate
                        ? new Date(response.data.data.resultDate).toISOString().split('T')[0]
                        : new Date().toISOString().split('T')[0]
                });
            }
        } catch (err) {
            setError('Failed to load test details');
            console.error('Error fetching test:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddParameter = () => {
        setFormData(prev => ({
            ...prev,
            testParameters: [...prev.testParameters, {
                parameter: '',
                value: '',
                unit: '',
                normalRange: '',
                isAbnormal: false,
                notes: ''
            }]
        }));
    };

    const handleRemoveParameter = (index) => {
        const updatedParams = formData.testParameters.filter((_, i) => i !== index);
        setFormData({ ...formData, testParameters: updatedParams });
    };

    const handleParameterChange = (index, field, value) => {
        const updatedParams = [...formData.testParameters];
        updatedParams[index][field] = value;

        // If value or normal range is changed, check if it's abnormal
        if (field === 'value' || field === 'normalRange') {
            const param = updatedParams[index];
            if (param.value && param.normalRange) {
                // Simple validation - you might want more complex logic here
                param.isAbnormal = !param.normalRange.includes(param.value);
            }
        }

        setFormData({ ...formData, testParameters: updatedParams });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        const hasEmptyParams = formData.testParameters.some(
            param => !param.parameter.trim() || !param.value.trim()
        );

        if (hasEmptyParams) {
            setError('Please fill in all required parameter fields');
            return;
        }

        try {
            setSubmitting(true);
            setError('');
            setSuccess('');

            const response = await api.put(`/lab-technician/tests/${id}/results`, formData);

            setSuccess('Test results saved successfully!');

            // Update test status to completed
            await api.put(`/lab-technician/tests/${id}/status`, { status: 'completed' });

            // Redirect after 2 seconds
            setTimeout(() => {
                navigate(`/lab-technician/tests/${id}`);
            }, 2000);

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save test results');
            console.error('Error saving results:', err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-4 text-gray-600">Loading test details...</p>
                </div>
            </div>
        );
    }

    if (!test) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <ExclamationTriangleIcon className="h-12 w-12 text-yellow-500 mx-auto" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">Test Not Found</h3>
                    <p className="mt-2 text-lg text-gray-500">The requested test could not be found.</p>
                    <Link
                        to="/lab-technician/tests"
                        className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Back to Tests
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        to={-1}
                        className="inline-flex items-center text-lg font-medium text-blue-600 hover:text-blue-800 mb-4"
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-1" />
                        Back to Test Details
                    </Link>

                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg mr-4">
                            <BeakerIcon className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Add Test Results</h1>
                            <p className="text-gray-600 mt-1">
                                Test: {test.testName} • ID: {test.testId}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                {success && (
                    <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <CheckCircleIcon className="h-5 w-5 text-green-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-lg text-green-700">{success}</p>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-lg text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Patient & Test Info */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-lg font-medium text-gray-700 mb-3">Patient Information</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-lg text-gray-600">Name:</span>
                                    <span className="text-lg font-medium text-gray-900">
                                        {test.patientId?.userId?.firstName} {test.patientId?.userId?.lastName}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-lg text-gray-600">Patient ID:</span>
                                    <span className="text-lg font-medium text-gray-900">{test.patientId?.patientId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-lg text-gray-600">Date of Birth:</span>
                                    <span className="text-lg font-medium text-gray-900">
                                        {new Date(test.patientId?.userId?.dateOfBirth).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-lg font-medium text-gray-700 mb-3">Test Information</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-lg text-gray-600">Test Type:</span>
                                    <span className="text-lg font-medium text-gray-900 capitalize">{test.testType}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-lg text-gray-600">Specimen:</span>
                                    <span className="text-lg font-medium text-gray-900">{test.specimenType || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-lg text-gray-600">Priority:</span>
                                    <span className="text-lg font-medium text-gray-900 capitalize">{test.priority}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Form */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6">
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-8">
                                {/* Test Parameters */}
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg font-medium text-gray-900">Test Parameters</h3>
                                        <button
                                            type="button"
                                            onClick={handleAddParameter}
                                            className="inline-flex items-center px-3 py-1 text-lg text-blue-600 hover:text-blue-800"
                                        >
                                            <PlusIcon className="h-4 w-4 mr-1" />
                                            Add Parameter
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        {formData.testParameters.map((param, index) => (
                                            <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h4 className="font-medium text-gray-900">Parameter #{index + 1}</h4>
                                                    {formData.testParameters.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveParameter(index)}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            <TrashIcon className="h-5 w-5" />
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
                                                    <div>
                                                        <label className="block text-lg font-medium text-gray-700 mb-2">
                                                            Parameter Name *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            value={param.parameter}
                                                            onChange={(e) => handleParameterChange(index, 'parameter', e.target.value)}
                                                            required
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-lg font-medium text-gray-700 mb-2">
                                                            Value *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            value={param.value}
                                                            onChange={(e) => handleParameterChange(index, 'value', e.target.value)}
                                                            required
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-lg font-medium text-gray-700 mb-2">
                                                            Unit
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            value={param.unit}
                                                            onChange={(e) => handleParameterChange(index, 'unit', e.target.value)}
                                                        />
                                                    </div>

                                                    <div className="md:col-span-2">
                                                        <label className="block text-lg font-medium text-gray-700 mb-2">
                                                            Normal Range
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            value={param.normalRange}
                                                            onChange={(e) => handleParameterChange(index, 'normalRange', e.target.value)}
                                                            placeholder="e.g., 0-100 or >10"
                                                        />
                                                    </div>

                                                    <div className="flex items-center">
                                                        <label className="flex items-center cursor-pointer">
                                                            <div className="relative">
                                                                <input
                                                                    type="checkbox"
                                                                    className="sr-only"
                                                                    checked={param.isAbnormal}
                                                                    onChange={(e) => handleParameterChange(index, 'isAbnormal', e.target.checked)}
                                                                />
                                                                <div className={`block w-10 h-6 rounded-full ${param.isAbnormal ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                                                                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${param.isAbnormal ? 'translate-x-4' : ''}`}></div>
                                                            </div>
                                                            <div className="ml-3 text-lg font-medium text-gray-700">
                                                                Abnormal Result
                                                            </div>
                                                        </label>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-lg font-medium text-gray-700 mb-2">
                                                        Notes
                                                    </label>
                                                    <textarea
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        rows="2"
                                                        value={param.notes}
                                                        onChange={(e) => handleParameterChange(index, 'notes', e.target.value)}
                                                    />
                                                </div>

                                                {param.isAbnormal && (
                                                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                                        <p className="text-lg text-red-700 font-medium">
                                                            ⚠️ This parameter value is outside the normal range
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Equipment Information */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                                        <DeviceTabletIcon className="h-5 w-5 mr-2 text-blue-500" />
                                        Equipment Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-lg font-medium text-gray-700 mb-2">
                                                Equipment Used
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={formData.equipmentUsed}
                                                onChange={(e) => setFormData({ ...formData, equipmentUsed: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-lg font-medium text-gray-700 mb-2">
                                                Equipment ID
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={formData.equipmentId}
                                                onChange={(e) => setFormData({ ...formData, equipmentId: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-lg font-medium text-gray-700 mb-2">
                                                Calibration Date
                                            </label>
                                            <input
                                                type="date"
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={formData.equipmentCalibrationDate}
                                                onChange={(e) => setFormData({ ...formData, equipmentCalibrationDate: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Result Notes & Date */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                                        <DocumentTextIcon className="h-5 w-5 mr-2 text-green-500" />
                                        Result Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-lg font-medium text-gray-700 mb-2">
                                                Result Notes
                                            </label>
                                            <textarea
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                rows="4"
                                                value={formData.resultNotes}
                                                onChange={(e) => setFormData({ ...formData, resultNotes: e.target.value })}
                                                placeholder="Enter any additional notes, observations, or interpretations..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-lg font-medium text-gray-700 mb-2">
                                                Result Date *
                                            </label>
                                            <input
                                                type="date"
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={formData.resultDate}
                                                onChange={(e) => setFormData({ ...formData, resultDate: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-lg font-medium text-gray-700 mb-2">
                                                Validation Status
                                            </label>
                                            <select
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={formData.validationStatus}
                                                onChange={(e) => setFormData({ ...formData, validationStatus: e.target.value })}
                                            >
                                                <option value="pending">Pending Review</option>
                                                <option value="approved">Approved</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                        </div>
                                    </div>

                                    {formData.validationStatus !== 'pending' && (
                                        <div className="mt-6">
                                            <label className="block text-lg font-medium text-gray-700 mb-2">
                                                Validator Notes
                                            </label>
                                            <textarea
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                rows="3"
                                                value={formData.validatorNotes}
                                                onChange={(e) => setFormData({ ...formData, validatorNotes: e.target.value })}
                                                placeholder="Enter validation notes or comments..."
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Form Actions */}
                                <div className="pt-6 border-t border-gray-200">
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-lg text-gray-600">
                                                {formData.testParameters.length} parameter(s) will be saved
                                            </p>
                                        </div>
                                        <div className="flex space-x-3">
                                            <Link
                                                to={`/lab-technician/tests/${id}`}
                                                className="px-6 py-3 border border-gray-300 text-lg font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                Cancel
                                            </Link>
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className={`px-6 py-3 text-lg font-medium rounded-lg text-white ${submitting
                                                    ? 'bg-green-400 cursor-not-allowed'
                                                    : 'bg-green-600 hover:bg-green-700'
                                                    }`}
                                            >
                                                {submitting ? (
                                                    <span className="flex items-center">
                                                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                                        Saving Results...
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center">
                                                        <CheckCircleIcon className="h-4 w-4 mr-2" />
                                                        Save Results & Complete Test
                                                    </span>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddTestResults;