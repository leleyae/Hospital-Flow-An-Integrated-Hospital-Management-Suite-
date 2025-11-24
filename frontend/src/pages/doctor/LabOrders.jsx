// src/pages/doctor/LabOrders.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Search,
    Filter,
    Plus,
    Beaker,
    User,

    AlertCircle,

    XCircle,
    Download,
    Eye,
    MoreVertical
} from 'lucide-react';
import doctorService from '../../services/doctorService';

const LabOrders = () => {
    const [labTests, setLabTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedType, setSelectedType] = useState('all');

    const statuses = [
        { id: 'all', label: 'All', color: 'gray' },
        { id: 'requested', label: 'Requested', color: 'blue' },
        { id: 'sample_collected', label: 'Sample Collected', color: 'yellow' },
        { id: 'in_progress', label: 'In Progress', color: 'purple' },
        { id: 'completed', label: 'Completed', color: 'green' },
        { id: 'cancelled', label: 'Cancelled', color: 'red' },
    ];

    const testTypes = [
        { id: 'all', label: 'All Types' },
        { id: 'blood', label: 'Blood Tests' },
        { id: 'urine', label: 'Urine Tests' },
        { id: 'imaging', label: 'Imaging' },
        { id: 'culture', label: 'Culture' },
        { id: 'other', label: 'Other' },
    ];

    useEffect(() => {
        fetchLabTests();
    }, []);

    const fetchLabTests = async () => {
        try {
            setLoading(true);
            const response = await doctorService.getLabTests();
            setLabTests(response.data.labTests || []);
        } catch (error) {
            console.error('Failed to fetch lab tests:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'requested': return 'bg-blue-100 text-blue-800';
            case 'sample_collected': return 'bg-yellow-100 text-yellow-800';
            case 'in_progress': return 'bg-purple-100 text-purple-800';
            case 'completed': return 'bg-green-100 text-green-800';
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

    const filteredTests = labTests.filter(test => {
        // Status filter
        if (selectedStatus !== 'all' && test.status !== selectedStatus) return false;

        // Type filter
        if (selectedType !== 'all' && test.testType !== selectedType) return false;

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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Lab Orders</h1>
                    <p className="text-gray-600 mt-2">Manage laboratory test requests and results</p>
                </div>
                <Link
                    to="/doctor/lab-orders/new"
                    className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New Lab Order
                </Link>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                    <div className="relative flex-1 md:max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by patient name, test ID, or test name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <div className="flex items-center space-x-2">
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {statuses.map(status => (
                                    <option key={status.id} value={status.id}>{status.label}</option>
                                ))}
                            </select>

                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {testTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.label}</option>
                                ))}
                            </select>
                        </div>

                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center">
                            <Filter className="w-4 h-4 mr-2" />
                            More Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Lab Tests Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Beaker className="w-6 h-6 text-blue-600 mr-3" />
                            <h2 className="text-xl font-bold text-gray-900">
                                Lab Tests
                                <span className="ml-2 text-sm font-normal text-gray-500">
                                    ({filteredTests.length} found)
                                </span>
                            </h2>
                        </div>
                    </div>
                </div>

                {filteredTests.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Patient / Test
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Priority
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Requested Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredTests.map((test) => (
                                    <tr key={test._id} className="hover:bg-gray-50 transition-colors duration-200">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                                        <User className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {test.patientId?.userId?.firstName} {test.patientId?.userId?.lastName}
                                                        </p>
                                                        <p className="text-sm text-gray-500">{test.testName}</p>
                                                        <p className="text-xs text-gray-400">ID: {test.testId}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                                                {test.testType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(test.priority)}`}>
                                                {test.priority?.toUpperCase() || 'ROUTINE'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                                                {test.status.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {new Date(test.requestedDate).toLocaleDateString()}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {new Date(test.requestedDate).toLocaleTimeString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                {test.status === 'completed' && test.attachment && (
                                                    <button
                                                        onClick={() => window.open(test.attachment, '_blank')}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                                        title="View Results"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                )}

                                                {test.status === 'completed' && test.attachment && (
                                                    <button
                                                        onClick={() => window.open(test.attachment, '_blank')}
                                                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                                        title="Download Results"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </button>
                                                )}

                                                {test.status === 'requested' && (
                                                    <button
                                                        onClick={() => {/* Handle cancel */ }}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                                        title="Cancel Test"
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
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Beaker className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No lab tests found</h3>
                        <p className="text-gray-500 mb-6">
                            {searchTerm || selectedStatus !== 'all' || selectedType !== 'all'
                                ? 'Try adjusting your search or filters'
                                : 'You have no lab tests yet'}
                        </p>
                        <Link
                            to="/doctor/lab-orders/new"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create First Lab Order
                        </Link>
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">Total Tests</p>
                    <p className="text-2xl font-bold text-blue-900">{labTests.length}</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600 font-medium">Completed</p>
                    <p className="text-2xl font-bold text-green-900">
                        {labTests.filter(t => t.status === 'completed').length}
                    </p>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-sm text-red-600 font-medium">Urgent Tests</p>
                    <p className="text-2xl font-bold text-red-900">
                        {labTests.filter(t => t.priority === 'urgent' || t.priority === 'stat').length}
                    </p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-yellow-600 font-medium">Pending</p>
                    <p className="text-2xl font-bold text-yellow-900">
                        {labTests.filter(t => t.status === 'requested' || t.status === 'in_progress').length}
                    </p>
                </div>
            </div>

            {/* Recent Results */}
            {labTests.filter(t => t.status === 'completed').length > 0 && (
                <div className="mt-8 bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Results</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {labTests
                            .filter(t => t.status === 'completed')
                            .slice(0, 3)
                            .map((test) => (
                                <div key={test._id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-medium text-gray-900">{test.testName}</h3>
                                        {test.testParameters?.some(p => p.notes?.includes('abnormal')) && (
                                            <AlertCircle className="w-5 h-5 text-red-500" />
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 mb-2">
                                        {test.patientId?.userId?.firstName} {test.patientId?.userId?.lastName}
                                    </p>
                                    <div className="text-xs text-gray-400 mb-3">
                                        Completed: {new Date(test.resultDate).toLocaleDateString()}
                                    </div>
                                    {test.testParameters?.slice(0, 2).map((param, idx) => (
                                        <div key={idx} className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600">{param.parameter}</span>
                                            <span className={`font-medium ${param.notes?.includes('abnormal') ? 'text-red-600' : 'text-gray-900'
                                                }`}>
                                                {param.value} {param.unit}
                                            </span>
                                        </div>
                                    ))}
                                    {test.testParameters?.length > 2 && (
                                        <p className="text-xs text-gray-500 mt-2 text-center">
                                            +{test.testParameters.length - 2} more parameters
                                        </p>
                                    )}
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LabOrders;