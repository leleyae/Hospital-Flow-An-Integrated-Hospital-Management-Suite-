// src/pages/doctor/LabOrders.jsx
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    Search,
    Filter,
    Plus,
    Beaker,
    User,
    AlertCircle,
    FileText,
    Download,
    Eye,
    MoreVertical,
    ChevronRight,
    Calendar,
    Clock,
    Tag,
    Activity,
    BarChart3,
    ExternalLink,
    CheckCircle,
    Clock as ClockIcon,
    XCircle,
    Loader2
} from 'lucide-react';
import doctorService from '../../services/doctorService';
import { format } from 'date-fns';

const LabOrders = () => {
    const [labTests, setLabTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [selectedPriority, setSelectedPriority] = useState('all');
    const [viewingResult, setViewingResult] = useState(null);
    const [resultModalOpen, setResultModalOpen] = useState(false);

    const statuses = [
        { id: 'all', label: 'All Status', color: 'gray', icon: Tag },
        { id: 'requested', label: 'Requested', color: 'blue', icon: ClockIcon },
        { id: 'sample_collected', label: 'Sample Collected', color: 'yellow', icon: Activity },
        { id: 'in_progress', label: 'In Progress', color: 'purple', icon: Loader2 },
        { id: 'completed', label: 'Completed', color: 'green', icon: CheckCircle },
        { id: 'cancelled', label: 'Cancelled', color: 'red', icon: XCircle },
    ];

    const testTypes = [
        { id: 'all', label: 'All Types', icon: Beaker },
        { id: 'blood', label: 'Blood Tests', icon: Activity },
        { id: 'urine', label: 'Urine Tests', icon: Beaker },
        { id: 'imaging', label: 'Imaging', icon: BarChart3 },
        { id: 'culture', label: 'Culture', icon: Beaker },
        { id: 'other', label: 'Other', icon: Tag },
    ];

    const priorities = [
        { id: 'all', label: 'All Priorities' },
        { id: 'stat', label: 'STAT', color: 'red' },
        { id: 'urgent', label: 'Urgent', color: 'orange' },
        { id: 'routine', label: 'Routine', color: 'green' },
    ];

    useEffect(() => {
        fetchLabTests();
    }, []);

    const fetchLabTests = async () => {
        try {
            setLoading(true);
            const response = await doctorService.getLabTests();
            setLabTests(response.tests || []);
        } catch (error) {
            console.error('Failed to fetch lab tests:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusConfig = (status) => {
        return statuses.find(s => s.id === status) || statuses[0];
    };

    const getPriorityConfig = (priority) => {
        return priorities.find(p => p.id === priority) || { label: priority?.toUpperCase() || 'ROUTINE', color: 'gray' };
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return format(new Date(dateString), 'MMM dd, yyyy');
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        return format(new Date(dateString), 'hh:mm a');
    };

    const filteredTests = useMemo(() => {
        return labTests.filter(test => {
            // Status filter
            if (selectedStatus !== 'all' && test.status !== selectedStatus) return false;

            // Type filter
            if (selectedType !== 'all' && test.testType !== selectedType) return false;

            // Priority filter
            if (selectedPriority !== 'all' && test.priority !== selectedPriority) return false;

            // Search filter
            if (searchTerm) {
                const patientName = `${test.patientId?.userId?.firstName || ''} ${test.patientId?.userId?.lastName || ''}`.toLowerCase();
                const testId = test.testId?.toLowerCase() || '';
                const testName = test.testName?.toLowerCase() || '';

                return (
                    patientName.includes(searchTerm.toLowerCase()) ||
                    testId.includes(searchTerm.toLowerCase()) ||
                    testName.includes(searchTerm.toLowerCase())
                );
            }

            return true;
        });
    }, [labTests, searchTerm, selectedStatus, selectedType, selectedPriority]);

    const viewResult = (test) => {
        setViewingResult(test);
        setResultModalOpen(true);
    };

    const downloadResult = async (test) => {
        if (test.attachment) {
            window.open(test.attachment, '_blank');
        }
    };

    const getAbnormalParameters = (test) => {
        if (!test.testParameters) return 0;
        return test.testParameters.filter(p =>
            p.notes?.toLowerCase().includes('abnormal') ||
            p.notes?.toLowerCase().includes('high') ||
            p.notes?.toLowerCase().includes('low')
        ).length;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading lab orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Laboratory Orders</h1>
                        <p className="text-gray-600 mt-1">Manage and track laboratory test requests</p>
                    </div>

                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-lg font-medium text-gray-600">Total Orders</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{labTests.length}</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <Beaker className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-lg font-medium text-gray-600">Pending Results</p>
                            <p className="text-2xl font-bold text-yellow-600 mt-1">
                                {labTests.filter(t => t.status === 'requested' || t.status === 'in_progress').length}
                            </p>
                        </div>
                        <div className="p-3 bg-yellow-50 rounded-lg">
                            <ClockIcon className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-lg font-medium text-gray-600">Completed</p>
                            <p className="text-2xl font-bold text-green-600 mt-1">
                                {labTests.filter(t => t.status === 'completed').length}
                            </p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-lg font-medium text-gray-600">Urgent Tests</p>
                            <p className="text-2xl font-bold text-red-600 mt-1">
                                {labTests.filter(t => t.priority === 'urgent' || t.priority === 'stat').length}
                            </p>
                        </div>
                        <div className="p-3 bg-red-50 rounded-lg">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="lg:col-span-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by patient name, test ID, or test name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                            />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col space-y-3">
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                        >
                            {statuses.map(status => {
                                const Icon = status.icon;
                                return (
                                    <option key={status.id} value={status.id}>
                                        {status.label}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div className="flex flex-col space-y-3">
                        <select
                            value={selectedPriority}
                            onChange={(e) => setSelectedPriority(e.target.value)}
                            className="px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                        >
                            {priorities.map(priority => (
                                <option key={priority.id} value={priority.id}>
                                    {priority.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Additional Filters */}
                <div className="mt-4 flex flex-wrap gap-2">
                    {testTypes.map(type => {
                        const Icon = type.icon;
                        const isActive = selectedType === type.id;
                        return (
                            <button
                                key={type.id}
                                onClick={() => setSelectedType(type.id)}
                                className={`inline-flex items-center px-3 py-2 rounded-lg transition-colors duration-200 ${isActive
                                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                <Icon className="w-4 h-4 mr-2" />
                                {type.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Lab Tests Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center">
                        <Beaker className="w-6 h-6 text-blue-600 mr-3" />
                        <h2 className="text-lg font-semibold text-gray-900">
                            Lab Orders
                            <span className="ml-2 text-lg font-normal text-gray-500">
                                ({filteredTests.length} orders)
                            </span>
                        </h2>
                    </div>
                    <button
                        onClick={fetchLabTests}
                        className="text-lg text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Refresh
                    </button>
                </div>

                {filteredTests.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-lg font-semibold text-gray-600 uppercase tracking-wider">
                                        Patient / Test Details
                                    </th>
                                    <th className="px-6 py-4 text-left text-lg font-semibold text-gray-600 uppercase tracking-wider">
                                        Priority
                                    </th>
                                    <th className="px-6 py-4 text-left text-lg font-semibold text-gray-600 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-lg font-semibold text-gray-600 uppercase tracking-wider">
                                        Timeline
                                    </th>
                                    <th className="px-6 py-4 text-left text-lg font-semibold text-gray-600 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredTests.map((test) => {
                                    const StatusIcon = getStatusConfig(test.status).icon;
                                    const abnormalCount = getAbnormalParameters(test);
                                    const hasResults = test.status === 'completed' && test.testParameters;

                                    return (
                                        <tr key={test._id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-6 py-5">
                                                <div className="flex items-start space-x-4">
                                                    <div className="flex-shrink-0">
                                                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                                                            <User className="w-6 h-6 text-blue-600" />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center mb-1">
                                                            <p className="text-lg font-semibold text-gray-900 truncate">
                                                                {test.patientId?.userId?.firstName} {test.patientId?.userId?.lastName}
                                                            </p>
                                                            {test.patientId?.userId?.age && (
                                                                <span className="ml-2 text-lg text-gray-500">
                                                                    • {test.patientId.userId.age} years
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-lg font-medium text-gray-900 mb-1">
                                                            {test.testName}
                                                        </p>
                                                        <div className="flex items-center text-lg text-gray-500">
                                                            <Tag className="w-3 h-3 mr-1" />
                                                            <span className="capitalize mr-3">{test.testType}</span>
                                                            <span className="text-gray-400">•</span>
                                                            <span className="ml-3">ID: {test.testId}</span>
                                                        </div>
                                                        {hasResults && abnormalCount > 0 && (
                                                            <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full bg-red-50 text-red-700 text-lg">
                                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                                {abnormalCount} abnormal value{abnormalCount !== 1 ? 's' : ''}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-lg font-semibold ${test.priority === 'stat' ? 'bg-red-100 text-red-800' :
                                                    test.priority === 'urgent' ? 'bg-orange-100 text-orange-800' :
                                                        'bg-green-100 text-green-800'
                                                    }`}>
                                                    {test.priority?.toUpperCase() || 'ROUTINE'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center">
                                                    <StatusIcon className={`w-4 h-4 mr-2 ${getStatusConfig(test.status).color === 'green' ? 'text-green-600' :
                                                        getStatusConfig(test.status).color === 'red' ? 'text-red-600' :
                                                            getStatusConfig(test.status).color === 'yellow' ? 'text-yellow-600' :
                                                                getStatusConfig(test.status).color === 'blue' ? 'text-blue-600' :
                                                                    'text-gray-600'
                                                        }`} />
                                                    <span className={`px-3 py-1 rounded-full text-lg font-medium ${getStatusConfig(test.status).color === 'green' ? 'bg-green-100 text-green-800' :
                                                        getStatusConfig(test.status).color === 'red' ? 'bg-red-100 text-red-800' :
                                                            getStatusConfig(test.status).color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                                                                getStatusConfig(test.status).color === 'blue' ? 'bg-blue-100 text-blue-800' :
                                                                    'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {test.status.replace('_', ' ').toUpperCase()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="space-y-1">
                                                    <div className="flex items-center text-lg text-gray-600">
                                                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                                        {formatDate(test.requestedDate)}
                                                    </div>
                                                    <div className="flex items-center text-lg text-gray-500">
                                                        <Clock className="w-3 h-3 mr-2 text-gray-400" />
                                                        {formatTime(test.requestedDate)}
                                                    </div>
                                                    {test.resultDate && (
                                                        <div className="text-lg text-gray-500 mt-2">
                                                            Result: {formatDate(test.resultDate)}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center space-x-2">
                                                    {test.status === 'completed' && (
                                                        <>
                                                            <button
                                                                onClick={() => viewResult(test)}
                                                                className="inline-flex items-center px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors duration-200 text-lg font-medium"
                                                            >
                                                                <Eye className="w-4 h-4 mr-2" />
                                                                View Results
                                                            </button>
                                                            {test.attachment && (
                                                                <button
                                                                    onClick={() => downloadResult(test)}
                                                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                                                    title="Download PDF"
                                                                >
                                                                    <Download className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </>
                                                    )}
                                                    {test.status === 'requested' && (
                                                        <button
                                                            onClick={() => {/* Handle cancel */ }}
                                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                                            title="Cancel Order"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Beaker className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No lab orders found</h3>
                        <p className="text-gray-500 max-w-md mx-auto mb-8">
                            {searchTerm || selectedStatus !== 'all' || selectedType !== 'all'
                                ? 'No orders match your search criteria. Try adjusting your filters.'
                                : 'Get started by creating your first lab order.'}
                        </p>
                        <Link
                            to="/doctor/lab-orders/new"
                            className="inline-flex items-center px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-sm"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Create Lab Order
                        </Link>
                    </div>
                )}
            </div>

            {/* Results Modal */}
            {resultModalOpen && viewingResult && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
                        {/* Modal Header */}
                        <div className="px-8 py-6 border-b border-gray-200 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Test Results</h2>
                                <p className="text-gray-600 text-lg mt-1">
                                    {viewingResult.testName} • {formatDate(viewingResult.resultDate)}
                                </p>
                            </div>
                            <div className="flex items-center space-x-4">
                                {viewingResult.attachment && (
                                    <button
                                        onClick={() => downloadResult(viewingResult)}
                                        className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors duration-200 text-lg font-medium"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download PDF
                                    </button>
                                )}
                                <button
                                    onClick={() => setResultModalOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                >
                                    <XCircle className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 overflow-y-auto max-h-[calc(90vh-140px)]">
                            {/* Patient Info */}
                            <div className="bg-blue-50 rounded-xl p-6 mb-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <p className="text-lg font-medium text-gray-600 mb-1">Patient</p>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {viewingResult.patientId?.userId?.firstName} {viewingResult.patientId?.userId?.lastName}
                                        </p>
                                        <p className="text-lg text-gray-500">
                                            {viewingResult.patientId?.userId?.age} years
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-lg font-medium text-gray-600 mb-1">Test ID</p>
                                        <p className="text-lg font-semibold text-gray-900">{viewingResult.testId}</p>
                                    </div>
                                    <div>
                                        <p className="text-lg font-medium text-gray-600 mb-1">Status</p>
                                        <span className={`px-3 py-1.5 rounded-full text-lg font-semibold ${getStatusConfig(viewingResult.status).color === 'green' ? 'bg-green-100 text-green-800' :
                                            getStatusConfig(viewingResult.status).color === 'red' ? 'bg-red-100 text-red-800' :
                                                'bg-blue-100 text-blue-800'
                                            }`}>
                                            {viewingResult.status.replace('_', ' ').toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Test Parameters */}
                            {viewingResult.testParameters && viewingResult.testParameters.length > 0 ? (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Test Parameters</h3>
                                    <div className="bg-gray-50 rounded-xl overflow-hidden">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="px-6 py-4 text-left text-lg font-semibold text-gray-700">Parameter</th>
                                                    <th className="px-6 py-4 text-left text-lg font-semibold text-gray-700">Result</th>
                                                    <th className="px-6 py-4 text-left text-lg font-semibold text-gray-700">Normal Range</th>
                                                    <th className="px-6 py-4 text-left text-lg font-semibold text-gray-700">Notes</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {viewingResult.testParameters.map((param, idx) => {
                                                    const isAbnormal = param.notes?.toLowerCase().includes('abnormal') ||
                                                        param.notes?.toLowerCase().includes('high') ||
                                                        param.notes?.toLowerCase().includes('low');
                                                    return (
                                                        <tr key={idx} className="hover:bg-white transition-colors duration-150">
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center">
                                                                    {isAbnormal && (
                                                                        <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                                                                    )}
                                                                    <span className={`font-medium ${isAbnormal ? 'text-red-700' : 'text-gray-900'}`}>
                                                                        {param.parameter}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className={`font-semibold ${isAbnormal ? 'text-red-700' : 'text-gray-900'}`}>
                                                                    {param.value} {param.unit}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-gray-600">
                                                                {param.normalRange || 'N/A'}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className={`px-3 py-1 rounded-full text-lg font-medium ${isAbnormal ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                                                                    }`}>
                                                                    {param.notes || 'Normal'}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">No detailed test parameters available</p>
                                </div>
                            )}

                            {/* Lab Comments */}
                            {viewingResult.labComments && (
                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Lab Comments</h3>
                                    <div className="bg-gray-50 rounded-xl p-6">
                                        <p className="text-gray-700">{viewingResult.labComments}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="px-8 py-6 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                            <div className="text-lg text-gray-500">
                                Ordered: {formatDate(viewingResult.requestedDate)} • Completed: {formatDate(viewingResult.resultDate)}
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setResultModalOpen(false)}
                                    className="px-5 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 font-medium"
                                >
                                    Close
                                </button>
                                {viewingResult.attachment && (
                                    <button
                                        onClick={() => downloadResult(viewingResult)}
                                        className="px-5 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors duration-200 font-medium flex items-center"
                                    >
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        Open Full Report
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Results Section */}
            {labTests.filter(t => t.status === 'completed').length > 0 && (
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Recently Completed Tests</h2>
                        <Link
                            to="/doctor/lab-results"
                            className="text-blue-600 hover:text-blue-800 font-medium text-lg flex items-center"
                        >
                            View All Results
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {labTests
                            .filter(t => t.status === 'completed')
                            .slice(0, 3)
                            .map((test) => {
                                const abnormalCount = getAbnormalParameters(test);
                                return (
                                    <div key={test._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{test.testName}</h3>
                                                <p className="text-lg text-gray-500 mt-1">
                                                    {test.patientId?.userId?.firstName} {test.patientId?.userId?.lastName}
                                                </p>
                                            </div>
                                            {abnormalCount > 0 && (
                                                <div className="flex-shrink-0">
                                                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                                        <AlertCircle className="w-4 h-4 text-red-600" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-3">
                                            {test.testParameters?.slice(0, 2).map((param, idx) => {
                                                const isAbnormal = param.notes?.toLowerCase().includes('abnormal');
                                                return (
                                                    <div key={idx} className="flex justify-between items-center">
                                                        <span className="text-lg text-gray-600">{param.parameter}</span>
                                                        <span className={`text-lg font-medium ${isAbnormal ? 'text-red-600' : 'text-gray-900'
                                                            }`}>
                                                            {param.value} {param.unit}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                            <span className="text-lg text-gray-500">
                                                {formatDate(test.resultDate)}
                                            </span>
                                            <button
                                                onClick={() => viewResult(test)}
                                                className="text-blue-600 hover:text-blue-800 text-lg font-medium flex items-center"
                                            >
                                                View Details
                                                <ChevronRight className="w-4 h-4 ml-1" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LabOrders;