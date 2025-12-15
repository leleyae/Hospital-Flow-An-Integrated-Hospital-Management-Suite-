// pages/lab-technician/LabTestDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../config/api';
import {
    ArrowLeftIcon,
    BeakerIcon,
    ClockIcon,
    DocumentTextIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    PencilIcon,
    PrinterIcon,
    ShareIcon,
    DocumentChartBarIcon
} from '@heroicons/react/24/outline';
import { Download } from 'lucide-react';

const LabTestDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [test, setTest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        fetchTestDetails();
    }, [id]);

    const fetchTestDetails = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/lab-technician/tests/${id}`);
            setTest(response.data.data);
        } catch (error) {
            console.error('Error fetching test details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        try {
            setUpdatingStatus(true);
            await api.put(`/lab-technician/tests/${id}/status`, { status: newStatus });
            fetchTestDetails();
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setUpdatingStatus(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'sample_collected': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'requested': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'stat': return 'bg-red-500';
            case 'urgent': return 'bg-orange-500';
            case 'routine': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Back to Tests
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={() => navigate(-1)}
                                className="inline-flex items-center text-lg font-medium text-blue-600 hover:text-blue-800 mr-4"
                            >
                                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                                Back to Tests
                            </button>
                            <div className="p-2 bg-blue-100 rounded-lg mr-4">
                                <BeakerIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{test.testName}</h1>
                                <p className="text-gray-600">Test ID: {test.testId}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 rounded-full text-lg font-medium ${getStatusColor(test.status)}`}>
                                {test.status.replace('_', ' ').toUpperCase()}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-lg font-medium ${getPriorityColor(test.priority)} text-white`}>
                                {test.priority.toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Status Actions */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Test Status Actions</h3>
                    <div className="flex flex-wrap gap-3">
                        {test.status === 'requested' && (
                            <button
                                onClick={() => handleStatusUpdate('sample_collected')}
                                disabled={updatingStatus}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {updatingStatus ? 'Updating...' : 'Mark as Sample Collected'}
                            </button>
                        )}
                        {test.status === 'sample_collected' && (
                            <button
                                onClick={() => handleStatusUpdate('in_progress')}
                                disabled={updatingStatus}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                            >
                                {updatingStatus ? 'Updating...' : 'Start Analysis'}
                            </button>
                        )}
                        {test.status === 'in_progress' && (
                            <Link
                                to={`/lab_technician/lab/${id}/results/add`}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                Add Test Results
                            </Link>
                        )}
                        {test.status === 'completed' && (
                            <button
                                onClick={() => window.print()}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                <PrinterIcon className="h-4 w-4 inline mr-2" />
                                Print Report
                            </button>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            {['overview', 'results', 'quality', 'history'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-4 px-6 text-lg font-medium border-b-2 transition-colors duration-200 ${activeTab === tab
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    {tab === 'overview' && 'Overview'}
                                    {tab === 'results' && 'Test Results'}
                                    {tab === 'quality' && 'Quality Control'}
                                    {tab === 'history' && 'History'}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-6">
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                {/* Test Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="text-lg font-medium text-gray-700 mb-3">Test Information</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-lg text-gray-600">Test Type:</span>
                                                <span className="text-lg font-medium text-gray-900 capitalize">{test.testType}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-lg text-gray-600">Specimen Type:</span>
                                                <span className="text-lg font-medium text-gray-900">{test.specimenType || 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-lg text-gray-600">Specimen Details:</span>
                                                <span className="text-lg font-medium text-gray-900">{test.specimenDetails || 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-lg text-gray-600">Priority:</span>
                                                <span className={`text-lg font-medium ${getPriorityColor(test.priority)} text-white px-2 py-0.5 rounded-full`}>
                                                    {test.priority.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="text-lg font-medium text-gray-700 mb-3">Timeline</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-lg text-gray-600">Requested:</span>
                                                <span className="text-lg font-medium text-gray-900">
                                                    {formatDateTime(test.requestedDate)}
                                                </span>
                                            </div>
                                            {test.sampleCollectionDate && (
                                                <div className="flex justify-between">
                                                    <span className="text-lg text-gray-600">Sample Collected:</span>
                                                    <span className="text-lg font-medium text-gray-900">
                                                        {formatDateTime(test.sampleCollectionDate)}
                                                    </span>
                                                </div>
                                            )}
                                            {test.analysisStartedDate && (
                                                <div className="flex justify-between">
                                                    <span className="text-lg text-gray-600">Analysis Started:</span>
                                                    <span className="text-lg font-medium text-gray-900">
                                                        {formatDateTime(test.analysisStartedDate)}
                                                    </span>
                                                </div>
                                            )}
                                            {test.resultDate && (
                                                <div className="flex justify-between">
                                                    <span className="text-lg text-gray-600">Results Available:</span>
                                                    <span className="text-lg font-medium text-gray-900">
                                                        {formatDateTime(test.resultDate)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Patient Information */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="text-lg font-medium text-gray-700 mb-3">Patient Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div>
                                            <p className="text-lg text-gray-500">Name</p>
                                            <p className="text-lg font-medium text-gray-900">
                                                {test.patientId?.userId?.firstName} {test.patientId?.userId?.lastName}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-lg text-gray-500">Patient ID</p>
                                            <p className="text-lg font-medium text-gray-900">{test.patientId?.patientId}</p>
                                        </div>
                                        <div>
                                            <p className="text-lg text-gray-500">Date of Birth</p>
                                            <p className="text-lg font-medium text-gray-900">
                                                {formatDate(test.patientId?.userId?.dateOfBirth)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-lg text-gray-500">Blood Group</p>
                                            <p className="text-lg font-medium text-gray-900">{test.patientId?.bloodGroup || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Doctor Information */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="text-lg font-medium text-gray-700 mb-3">Requesting Doctor</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-lg text-gray-500">Name</p>
                                            <p className="text-lg font-medium text-gray-900">
                                                Dr. {test.doctorId?.userId?.firstName} {test.doctorId?.userId?.lastName}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-lg text-gray-500">Specialization</p>
                                            <p className="text-lg font-medium text-gray-900">{test.doctorId?.specialization}</p>
                                        </div>
                                        <div>
                                            <p className="text-lg text-gray-500">Department</p>
                                            <p className="text-lg font-medium text-gray-900">{test.doctorId?.department}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'results' && (
                            <div>
                                {test.testParameters && test.testParameters.length > 0 ? (
                                    <div className="overflow-x-auto">
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
                                                        Status
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                                                        Notes
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {test.testParameters.map((param, index) => (
                                                    <tr key={index}>
                                                        <td className="px-6 py-4 text-lg text-gray-900">{param.parameter}</td>
                                                        <td className="px-6 py-4 text-lg font-medium text-gray-900">
                                                            {param.value}
                                                        </td>
                                                        <td className="px-6 py-4 text-lg text-gray-900">{param.unit}</td>
                                                        <td className="px-6 py-4 text-lg text-gray-900">{param.normalRange}</td>
                                                        <td className="px-6 py-4">
                                                            {param.isAbnormal ? (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-lg font-medium bg-red-100 text-red-800">
                                                                    ABNORMAL
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-lg font-medium bg-green-100 text-green-800">
                                                                    NORMAL
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-lg text-gray-900">{param.notes}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                        <p className="text-gray-500">No test results available yet</p>
                                        {test.status === 'in_progress' && (
                                            <Link
                                                to={`/lab-technician/tests/${id}/results/add`}
                                                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                            >
                                                <PencilIcon className="h-4 w-4 mr-2" />
                                                Add Results
                                            </Link>
                                        )}
                                    </div>
                                )}

                                {/* Result Notes */}
                                {test.resultNotes && (
                                    <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                        <h4 className="text-lg font-medium text-yellow-800 mb-2">Result Notes</h4>
                                        <p className="text-lg text-yellow-700">{test.resultNotes}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'quality' && (
                            <div>
                                {test.qualityControl && test.qualityControl.length > 0 ? (
                                    <div className="space-y-4">
                                        {test.qualityControl.map((qc, index) => (
                                            <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h5 className="font-medium text-gray-900 capitalize">{qc.qcType} Quality Control</h5>
                                                        <p className="text-lg text-gray-600">Performed by: {qc.performedBy?.name || 'N/A'}</p>
                                                    </div>
                                                    <span className={`px-2 py-1 rounded text-lg font-medium ${qc.qcStatus === 'pass' ? 'bg-green-100 text-green-800' :
                                                        qc.qcStatus === 'fail' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {qc.qcStatus.toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <span className="text-lg text-gray-600">QC Value:</span>
                                                        <p className="text-lg font-medium text-gray-900">{qc.qcValue}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-lg text-gray-600">Expected Value:</span>
                                                        <p className="text-lg font-medium text-gray-900">{qc.expectedValue}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-lg text-gray-600">Deviation:</span>
                                                        <p className="text-lg font-medium text-gray-900">{qc.deviation || 'N/A'}</p>
                                                    </div>
                                                </div>
                                                {qc.notes && (
                                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                                        <span className="text-lg text-gray-600">Notes:</span>
                                                        <p className="text-lg text-gray-900 mt-1">{qc.notes}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <DocumentChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                        <p className="text-gray-500">No quality control data available</p>
                                        <p className="text-lg text-gray-400 mt-1">
                                            Quality control data will be added after test completion
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'history' && (
                            <div className="space-y-4">
                                {test.statusHistory && test.statusHistory.length > 0 ? (
                                    test.statusHistory.map((history, index) => (
                                        <div key={index} className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${history.status === 'completed' ? 'bg-green-100 text-green-600' :
                                                    history.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                                                        history.status === 'sample_collected' ? 'bg-purple-100 text-purple-600' :
                                                            'bg-yellow-100 text-yellow-600'
                                                    }`}>
                                                    <CheckCircleIcon className="h-4 w-4" />
                                                </div>
                                            </div>
                                            <div className="ml-4 flex-1">
                                                <div className="flex justify-between items-center">
                                                    <h4 className="text-lg font-medium text-gray-900">
                                                        {history.status.replace('_', ' ').toUpperCase()}
                                                    </h4>
                                                    <span className="text-lg text-gray-500">
                                                        {formatDateTime(history.timestamp)}
                                                    </span>
                                                </div>
                                                <p className="text-lg text-gray-600 mt-1">
                                                    {history.notes || 'Status updated'}
                                                </p>
                                                {history.updatedBy && (
                                                    <p className="text-lg text-gray-500 mt-1">
                                                        By: {history.updatedBy}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                        <p className="text-gray-500">No history available</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between">
                    <div className="flex space-x-3">
                        <button
                            onClick={() => window.print()}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                            <PrinterIcon className="h-4 w-4 mr-2" />
                            Print Report
                        </button>
                        <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                            <ShareIcon className="h-4 w-4 mr-2" />
                            Share Results
                        </button>
                        <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                        </button>
                    </div>
                    {test.status === 'in_progress' && (
                        <Link
                            to={`/lab-technician/tests/${id}/results/add`}
                            className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
                        >
                            <PencilIcon className="h-5 w-5 mr-2" />
                            Enter Test Results
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LabTestDetail;