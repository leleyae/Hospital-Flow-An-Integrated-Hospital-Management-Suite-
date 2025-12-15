// pages/lab-technician/LabTestList.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../config/api';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    ArrowPathIcon,
    EyeIcon,
    PlusIcon,
    ChevronRightIcon,
    ChevronLeftIcon,
    UserCircleIcon,
    BeakerIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

const LabTestList = () => {
    const navigate = useNavigate();
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        testType: '',
        dateFrom: '',
        dateTo: '',
        search: '',
        page: 1,
        limit: 20
    });
    const [pagination, setPagination] = useState({});
    const [totalTests, setTotalTests] = useState(0);

    const statusOptions = [
        { value: '', label: 'All Status' },
        { value: 'requested', label: 'Requested' },
        { value: 'sample_collected', label: 'Sample Collected' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
    ];

    const priorityOptions = [
        { value: '', label: 'All Priority' },
        { value: 'routine', label: 'Routine' },
        { value: 'urgent', label: 'Urgent' },
        { value: 'stat', label: 'STAT' }
    ];

    useEffect(() => {
        fetchTests();
    }, [filters]);

    const fetchTests = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });

            const response = await api.get(`/lab-technician/tests?${params}`);
            setTests(response.data.data.tests || []);
            setPagination(response.data.data.pagination || {});
            setTotalTests(response.data.data.pagination?.total || 0);
        } catch (error) {
            console.error('Error fetching tests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters({ ...filters, [key]: value, page: 1 });
    };

    const handleResetFilters = () => {
        setFilters({
            status: '',
            priority: '',
            testType: '',
            dateFrom: '',
            dateTo: '',
            search: '',
            page: 1,
            limit: 20
        });
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
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading && tests.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-4 text-gray-600">Loading tests...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Lab Tests Management</h1>
                            <p className="text-gray-600 mt-2">View and manage all laboratory tests</p>
                        </div>

                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                            <label className="block text-lg font-medium text-gray-700 mb-2">Status</label>
                            <select
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                            >
                                {statusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-lg font-medium text-gray-700 mb-2">Priority</label>
                            <select
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={filters.priority}
                                onChange={(e) => handleFilterChange('priority', e.target.value)}
                            >
                                {priorityOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-lg font-medium text-gray-700 mb-2">From Date</label>
                            <input
                                type="date"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={filters.dateFrom}
                                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-lg font-medium text-gray-700 mb-2">To Date</label>
                            <input
                                type="date"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={filters.dateTo}
                                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex-1 mr-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by test ID, patient name, or test type..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={fetchTests}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                            >
                                <ArrowPathIcon className="h-4 w-4 mr-2" />
                                Refresh
                            </button>
                            <button
                                onClick={handleResetFilters}
                                className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tests Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">
                                Tests ({totalTests})
                            </h3>
                            <div className="text-lg text-gray-500">
                                Showing {((filters.page - 1) * filters.limit) + 1} to{' '}
                                {Math.min(filters.page * filters.limit, totalTests)} of {totalTests}
                            </div>
                        </div>
                    </div>

                    {tests.length === 0 ? (
                        <div className="text-center py-12">
                            <BeakerIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500">No tests found</p>
                            <p className="text-lg text-gray-400 mt-1">Try changing your filters</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                                            Test Details
                                        </th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                                            Patient
                                        </th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                                            Priority
                                        </th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                                            Timeline
                                        </th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {tests.map((test) => (
                                        <tr key={test._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="text-lg font-medium text-gray-900">
                                                        {test.testName}
                                                    </div>
                                                    <div className="text-lg text-gray-500">
                                                        {test.testType} • {test.specimenType || 'N/A'}
                                                    </div>
                                                    <div className="text-lg text-gray-400 mt-1">
                                                        ID: {test.testId}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                                        <UserCircleIcon className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <div className="text-lg font-medium text-gray-900">
                                                            {test.patientId?.userId?.firstName} {test.patientId?.userId?.lastName}
                                                        </div>
                                                        <div className="text-lg text-gray-500">
                                                            ID: {test.patientId?.patientId}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-lg font-medium ${getPriorityColor(test.priority)} text-white`}>
                                                    {test.priority.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-lg font-medium ${getStatusColor(test.status)}`}>
                                                    {test.status.replace('_', ' ').toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-lg text-gray-900">
                                                    {formatDate(test.requestedDate)}
                                                </div>
                                                <div className="text-lg text-gray-500">
                                                    {formatTime(test.requestedDate)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex space-x-2">
                                                    <Link
                                                        to={`/lab_technician/lab/${test._id}`}
                                                        className="inline-flex items-center px-3 py-1 text-lg text-blue-600 hover:text-blue-800"
                                                    >
                                                        <EyeIcon className="h-4 w-4 mr-1" />
                                                        View
                                                    </Link>
                                                    {test.status === 'in_progress' && (
                                                        <Link
                                                            to={`/lab_technician/lab/${test._id}/results/add`}
                                                            className="inline-flex items-center px-3 py-1 text-lg text-green-600 hover:text-green-800"
                                                        >
                                                            <PlusIcon className="h-4 w-4 mr-1" />
                                                            Results
                                                        </Link>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div className="text-lg text-gray-700">
                                    Page {filters.page} of {pagination.pages}
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleFilterChange('page', filters.page - 1)}
                                        disabled={filters.page === 1}
                                        className={`px-3 py-1 rounded-lg border ${filters.page === 1
                                            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <ChevronLeftIcon className="h-5 w-5" />
                                    </button>
                                    {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                                        let pageNum;
                                        if (pagination.pages <= 5) {
                                            pageNum = i + 1;
                                        } else if (filters.page <= 3) {
                                            pageNum = i + 1;
                                        } else if (filters.page >= pagination.pages - 2) {
                                            pageNum = pagination.pages - 4 + i;
                                        } else {
                                            pageNum = filters.page - 2 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => handleFilterChange('page', pageNum)}
                                                className={`px-3 py-1 rounded-lg border ${filters.page === pageNum
                                                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                    <button
                                        onClick={() => handleFilterChange('page', filters.page + 1)}
                                        disabled={filters.page === pagination.pages}
                                        className={`px-3 py-1 rounded-lg border ${filters.page === pagination.pages
                                            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <ChevronRightIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LabTestList;