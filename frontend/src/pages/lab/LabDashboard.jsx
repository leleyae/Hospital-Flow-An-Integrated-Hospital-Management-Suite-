import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/api';
import {
    BeakerIcon,
    ClockIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    UserCircleIcon,
    ChartBarIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    CalendarIcon,
    DocumentChartBarIcon,
    EyeIcon,
    PencilIcon,
    ArrowPathIcon,
    PlusIcon,
    ChartPieIcon,
    ChevronRightIcon,
    ChevronLeftIcon
} from '@heroicons/react/24/outline';

const LabTechnicianDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        dateFrom: '',
        dateTo: '',
        patientName: '',
        page: 1,
        limit: 20
    });
    const [pagination, setPagination] = useState({});
    const [selectedTest, setSelectedTest] = useState(null);
    const [showTestModal, setShowTestModal] = useState(false);
    const [showResultsModal, setShowResultsModal] = useState(false);
    const [showQCModal, setShowQCModal] = useState(false);

    // Test results form
    const [testResultsForm, setTestResultsForm] = useState({
        testParameters: [{
            parameter: '',
            value: '',
            unit: '',
            normalRange: '',
            notes: ''
        }],
        resultNotes: '',
        equipmentUsed: '',
        equipmentId: '',
        equipmentCalibrationDate: '',
        resultDate: new Date().toISOString().split('T')[0]
    });

    // QC form
    const [qcForm, setQcForm] = useState([{
        qcType: 'internal',
        qcValue: '',
        expectedValue: '',
        qcStatus: 'pending',
        notes: ''
    }]);

    useEffect(() => {
        fetchDashboardData();
        if (activeTab === 'tests') {
            fetchTests();
        }
    }, [activeTab, filters]);

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/lab-technician/dashboard');
            setStats(response.data.data);
        } catch (error) {
            console.error('Error fetching dashboard:', error);
        }
    };

    const fetchTests = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams(filters).toString();
            const response = await api.get(`/lab-technician/tests?${params}`);
            setTests(response.data.data.tests);
            setPagination(response.data.data.pagination);
        } catch (error) {
            console.error('Error fetching tests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewTest = async (testId) => {
        try {
            const response = await api.get(`/lab-technician/tests/${testId}`);
            setSelectedTest(response.data.data);
            setShowTestModal(true);
        } catch (error) {
            console.error('Error fetching test details:', error);
        }
    };

    const handleUpdateStatus = async (testId, status) => {
        try {
            await api.put(`/lab-technician/tests/${testId}/status`, { status });
            fetchTests();
            if (selectedTest?._id === testId) {
                handleViewTest(testId); // Refresh selected test
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleSubmitResults = async () => {
        try {
            await api.put(`/lab-technician/tests/${selectedTest._id}/results`, testResultsForm);
            setShowResultsModal(false);
            fetchTests();
            handleViewTest(selectedTest._id);
            // Reset form
            setTestResultsForm({
                testParameters: [{
                    parameter: '',
                    value: '',
                    unit: '',
                    normalRange: '',
                    notes: ''
                }],
                resultNotes: '',
                equipmentUsed: '',
                equipmentId: '',
                equipmentCalibrationDate: '',
                resultDate: new Date().toISOString().split('T')[0]
            });
        } catch (error) {
            console.error('Error submitting results:', error);
        }
    };

    const handleAddParameter = () => {
        setTestResultsForm(prev => ({
            ...prev,
            testParameters: [...prev.testParameters, {
                parameter: '',
                value: '',
                unit: '',
                normalRange: '',
                notes: ''
            }]
        }));
    };

    const handleParameterChange = (index, field, value) => {
        const updatedParams = [...testResultsForm.testParameters];
        updatedParams[index][field] = value;
        setTestResultsForm({ ...testResultsForm, testParameters: updatedParams });
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

    const getStatusBadge = (status) => {
        return status.replace('_', ' ').toUpperCase();
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Dashboard Component
    const DashboardView = () => {
        if (!stats) return null;

        return (
            <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Tests</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.summary.totalTests}</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <BeakerIcon className="h-8 w-8 text-blue-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="flex items-center text-sm text-gray-600">
                                <ArrowPathIcon className="h-4 w-4 mr-1" />
                                <span>{stats.summary.completionRate}% completion rate</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Today's Tests</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.summary.todayTests}</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg">
                                <CalendarIcon className="h-8 w-8 text-green-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="flex items-center text-sm text-gray-600">
                                <CheckCircleIcon className="h-4 w-4 mr-1 text-green-500" />
                                <span>{stats.summary.completedToday} completed today</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pending Tests</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.summary.pendingTests}</p>
                            </div>
                            <div className="p-3 bg-yellow-50 rounded-lg">
                                <ClockIcon className="h-8 w-8 text-yellow-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="flex items-center text-sm text-gray-600">
                                <ExclamationTriangleIcon className="h-4 w-4 mr-1 text-yellow-500" />
                                <span>Require attention</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Weekly Activity</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {stats.weeklyActivity?.reduce((sum, day) => sum + day.count, 0) || 0}
                                </p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-lg">
                                <ChartBarIcon className="h-8 w-8 text-purple-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="flex items-center text-sm text-gray-600">
                                <ChartPieIcon className="h-4 w-4 mr-1" />
                                <span>{stats.weeklyActivity?.length || 0} active days</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Priority Distribution */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Distribution</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {stats.priorityDistribution?.map((item, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-700 capitalize">{item._id}</span>
                                    <span className="text-sm text-gray-600">{item.count} tests</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className={`h-2.5 rounded-full ${getPriorityColor(item._id)}`}
                                        style={{
                                            width: `${(item.count / stats.summary.totalTests) * 100}%`
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <button
                            onClick={() => setActiveTab('tests')}
                            className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                        >
                            <div className="flex items-center">
                                <BeakerIcon className="h-6 w-6 text-blue-600 mr-3" />
                                <span className="font-medium text-blue-700">View All Tests</span>
                            </div>
                        </button>
                        <button
                            onClick={() => navigate('/lab-technician/calendar')}
                            className="p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
                        >
                            <div className="flex items-center">
                                <CalendarIcon className="h-6 w-6 text-green-600 mr-3" />
                                <span className="font-medium text-green-700">Schedule</span>
                            </div>
                        </button>
                        <button
                            onClick={() => navigate('/lab-technician/reports')}
                            className="p-4 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors"
                        >
                            <div className="flex items-center">
                                <DocumentChartBarIcon className="h-6 w-6 text-purple-600 mr-3" />
                                <span className="font-medium text-purple-700">Generate Reports</span>
                            </div>
                        </button>
                        <button
                            onClick={() => navigate('/lab-technician/equipment')}
                            className="p-4 bg-orange-50 rounded-lg border border-orange-200 hover:bg-orange-100 transition-colors"
                        >
                            <div className="flex items-center">
                                <ChartBarIcon className="h-6 w-6 text-orange-600 mr-3" />
                                <span className="font-medium text-orange-700">Equipment Status</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Tests List Component
    const TestsListView = () => {
        return (
            <div className="space-y-6">
                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                            <div className="relative flex-1 md:w-64">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by patient name..."
                                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={filters.patientName}
                                    onChange={(e) => setFilters({ ...filters, patientName: e.target.value, page: 1 })}
                                />
                            </div>
                            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                <FunnelIcon className="h-5 w-5 text-gray-600" />
                            </button>
                        </div>

                        <div className="flex space-x-3">
                            <select
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                            >
                                <option value="">All Status</option>
                                <option value="requested">Requested</option>
                                <option value="sample_collected">Sample Collected</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>

                            <select
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={filters.priority}
                                onChange={(e) => setFilters({ ...filters, priority: e.target.value, page: 1 })}
                            >
                                <option value="">All Priorities</option>
                                <option value="routine">Routine</option>
                                <option value="urgent">Urgent</option>
                                <option value="stat">STAT</option>
                            </select>
                        </div>
                    </div>

                    {/* Date Filters */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                            <input
                                type="date"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={filters.dateFrom}
                                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value, page: 1 })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                            <input
                                type="date"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={filters.dateTo}
                                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value, page: 1 })}
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={() => setFilters({
                                    status: '',
                                    priority: '',
                                    dateFrom: '',
                                    dateTo: '',
                                    patientName: '',
                                    page: 1,
                                    limit: 20
                                })}
                                className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tests List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            <p className="mt-2 text-gray-600">Loading tests...</p>
                        </div>
                    ) : tests.length === 0 ? (
                        <div className="p-8 text-center">
                            <BeakerIcon className="h-12 w-12 text-gray-400 mx-auto" />
                            <p className="mt-2 text-gray-600">No tests found</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Test Details
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Patient
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Priority
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Requested
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {tests.map((test) => (
                                            <tr key={test._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{test.testName}</p>
                                                        <p className="text-sm text-gray-500">{test.testType} • {test.specimenType || 'N/A'}</p>
                                                        <p className="text-xs text-gray-400 mt-1">ID: {test.testId}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                                            <UserCircleIcon className="h-5 w-5 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {test.patientId?.userId?.firstName} {test.patientId?.userId?.lastName}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                DOB: {formatDate(test.patientId?.userId?.dateOfBirth)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(test.priority)} text-white`}>
                                                        {test.priority.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                                                        {getStatusBadge(test.status)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">{formatDate(test.requestedDate)}</div>
                                                    <div className="text-xs text-gray-500">{formatTime(test.requestedDate)}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleViewTest(test._id)}
                                                            className="p-1 text-blue-600 hover:text-blue-800"
                                                            title="View Details"
                                                        >
                                                            <EyeIcon className="h-5 w-5" />
                                                        </button>
                                                        {test.status === 'in_progress' && (
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedTest(test);
                                                                    setShowResultsModal(true);
                                                                }}
                                                                className="p-1 text-green-600 hover:text-green-800"
                                                                title="Add Results"
                                                            >
                                                                <PlusIcon className="h-5 w-5" />
                                                            </button>
                                                        )}
                                                        {test.status === 'completed' && !test.validationStatus && (
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedTest(test);
                                                                    setShowQCModal(true);
                                                                }}
                                                                className="p-1 text-purple-600 hover:text-purple-800"
                                                                title="Add QC Data"
                                                            >
                                                                <ChartBarIcon className="h-5 w-5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {pagination.pages > 1 && (
                                <div className="px-6 py-4 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-700">
                                            Showing <span className="font-medium">{((filters.page - 1) * filters.limit) + 1}</span> to{' '}
                                            <span className="font-medium">
                                                {Math.min(filters.page * filters.limit, pagination.total)}
                                            </span>{' '}
                                            of <span className="font-medium">{pagination.total}</span> tests
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
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
                                                        onClick={() => setFilters({ ...filters, page: pageNum })}
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
                                                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
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
                        </>
                    )}
                </div>
            </div>
        );
    };

    // Test Details Modal
    const TestDetailsModal = () => {
        if (!selectedTest) return null;

        return (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">{selectedTest.testName}</h3>
                            <p className="text-sm text-gray-500">ID: {selectedTest.testId}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTest.status)}`}>
                                {getStatusBadge(selectedTest.status)}
                            </span>
                            <button
                                onClick={() => setShowTestModal(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Test Information Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Patient Information</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Name:</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {selectedTest.patientId?.userId?.firstName} {selectedTest.patientId?.userId?.lastName}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Patient ID:</span>
                                        <span className="text-sm font-medium text-gray-900">{selectedTest.patientId?.patientId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Blood Group:</span>
                                        <span className="text-sm font-medium text-gray-900">{selectedTest.patientId?.bloodGroup || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Date of Birth:</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {formatDate(selectedTest.patientId?.userId?.dateOfBirth)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Test Information</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Test Type:</span>
                                        <span className="text-sm font-medium text-gray-900 capitalize">{selectedTest.testType}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Specimen:</span>
                                        <span className="text-sm font-medium text-gray-900">{selectedTest.specimenType || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Priority:</span>
                                        <span className={`text-sm font-medium ${getPriorityColor(selectedTest.priority)} text-white px-2 py-0.5 rounded-full`}>
                                            {selectedTest.priority.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Requested:</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {formatDate(selectedTest.requestedDate)} {formatTime(selectedTest.requestedDate)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Doctor & Appointment Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Requesting Doctor</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Name:</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            Dr. {selectedTest.doctorId?.userId?.firstName} {selectedTest.doctorId?.userId?.lastName}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Specialization:</span>
                                        <span className="text-sm font-medium text-gray-900">{selectedTest.doctorId?.specialization}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Department:</span>
                                        <span className="text-sm font-medium text-gray-900">{selectedTest.doctorId?.department}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Appointment Details</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Appointment ID:</span>
                                        <span className="text-sm font-medium text-gray-900">{selectedTest.appointmentId?.appointmentId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Date:</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {formatDate(selectedTest.appointmentId?.appointmentDate)}
                                        </span>
                                    </div>
                                    {selectedTest.appointmentId?.symptoms && (
                                        <div>
                                            <span className="text-sm text-gray-600">Symptoms:</span>
                                            <p className="text-sm font-medium text-gray-900 mt-1">
                                                {selectedTest.appointmentId.symptoms.join(', ')}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Test Results Section */}
                        {selectedTest.testParameters && selectedTest.testParameters.length > 0 && (
                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Test Results</h4>
                                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Parameter
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Value
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Unit
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Normal Range
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Notes
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {selectedTest.testParameters.map((param, index) => (
                                                <tr key={index}>
                                                    <td className="px-4 py-3 text-sm text-gray-900">{param.parameter}</td>
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{param.value}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-900">{param.unit}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-900">{param.normalRange}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-900">{param.notes}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Quality Control Section */}
                        {selectedTest.qualityControl && selectedTest.qualityControl.length > 0 && (
                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Quality Control</h4>
                                <div className="space-y-3">
                                    {selectedTest.qualityControl.map((qc, index) => (
                                        <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-sm font-medium text-gray-900 capitalize">{qc.qcType} QC</span>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${qc.qcStatus === 'pass' ? 'bg-green-100 text-green-800' :
                                                    qc.qcStatus === 'fail' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {qc.qcStatus.toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-600">Value: </span>
                                                    <span className="font-medium">{qc.qcValue}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">Expected: </span>
                                                    <span className="font-medium">{qc.expectedValue}</span>
                                                </div>
                                                {qc.notes && (
                                                    <div className="col-span-2">
                                                        <span className="text-gray-600">Notes: </span>
                                                        <span className="font-medium">{qc.notes}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Status Actions */}
                        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                            {selectedTest.status === 'requested' && (
                                <button
                                    onClick={() => handleUpdateStatus(selectedTest._id, 'sample_collected')}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Mark as Sample Collected
                                </button>
                            )}
                            {selectedTest.status === 'sample_collected' && (
                                <button
                                    onClick={() => handleUpdateStatus(selectedTest._id, 'in_progress')}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    Start Analysis
                                </button>
                            )}
                            {selectedTest.status === 'in_progress' && (
                                <button
                                    onClick={() => {
                                        setShowTestModal(false);
                                        setShowResultsModal(true);
                                    }}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Add Test Results
                                </button>
                            )}
                            {selectedTest.status === 'completed' && !selectedTest.validationStatus && (
                                <button
                                    onClick={() => {
                                        setShowTestModal(false);
                                        setShowQCModal(true);
                                    }}
                                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                                >
                                    Add Quality Control
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Add Test Results Modal
    const AddResultsModal = () => {
        return (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900">Add Test Results</h3>
                        <button
                            onClick={() => setShowResultsModal(false)}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="p-6">
                        <div className="mb-6">
                            <h4 className="text-sm font-medium text-gray-700 mb-3">Test Parameters</h4>
                            {testResultsForm.testParameters.map((param, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                                    <div className="flex justify-between items-center mb-3">
                                        <h5 className="font-medium text-gray-900">Parameter #{index + 1}</h5>
                                        {index > 0 && (
                                            <button
                                                onClick={() => {
                                                    const updatedParams = testResultsForm.testParameters.filter((_, i) => i !== index);
                                                    setTestResultsForm({ ...testResultsForm, testParameters: updatedParams });
                                                }}
                                                className="text-red-600 hover:text-red-800 text-sm"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
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
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
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
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Unit
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={param.unit}
                                                onChange={(e) => handleParameterChange(index, 'unit', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Normal Range
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={param.normalRange}
                                                onChange={(e) => handleParameterChange(index, 'normalRange', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Notes
                                        </label>
                                        <textarea
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            rows="2"
                                            value={param.notes}
                                            onChange={(e) => handleParameterChange(index, 'notes', e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={handleAddParameter}
                                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-gray-800 hover:border-gray-400 transition-colors"
                            >
                                + Add Another Parameter
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Equipment Used
                                </label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={testResultsForm.equipmentUsed}
                                    onChange={(e) => setTestResultsForm({ ...testResultsForm, equipmentUsed: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Equipment ID
                                </label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={testResultsForm.equipmentId}
                                    onChange={(e) => setTestResultsForm({ ...testResultsForm, equipmentId: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Result Notes
                            </label>
                            <textarea
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                rows="3"
                                value={testResultsForm.resultNotes}
                                onChange={(e) => setTestResultsForm({ ...testResultsForm, resultNotes: e.target.value })}
                            />
                        </div>

                        <div className="flex justify-between items-center">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Result Date
                                </label>
                                <input
                                    type="date"
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={testResultsForm.resultDate}
                                    onChange={(e) => setTestResultsForm({ ...testResultsForm, resultDate: e.target.value })}
                                />
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowResultsModal(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitResults}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Save Results
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <BeakerIcon className="h-8 w-8 text-blue-600 mr-3" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Lab Technician Portal</h1>
                                <p className="text-sm text-gray-600">Manage lab tests and results</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="p-2 text-gray-600 hover:text-gray-900">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </button>
                            <div className="relative">
                                <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">
                                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                        <span className="text-blue-600 font-semibold">LT</span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">Lab Technician</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'dashboard'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={() => setActiveTab('tests')}
                            className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'tests'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            My Tests
                        </button>
                        <button
                            onClick={() => setActiveTab('calendar')}
                            className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'calendar'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Calendar
                        </button>
                        <button
                            onClick={() => setActiveTab('reports')}
                            className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'reports'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Reports
                        </button>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'dashboard' && <DashboardView />}
                {activeTab === 'tests' && <TestsListView />}
                {activeTab === 'calendar' && (
                    <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                        <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">Calendar feature coming soon...</p>
                    </div>
                )}
                {activeTab === 'reports' && (
                    <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                        <DocumentChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">Reports feature coming soon...</p>
                    </div>
                )}
            </main>

            {/* Modals */}
            {showTestModal && <TestDetailsModal />}
            {showResultsModal && <AddResultsModal />}
            {showQCModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Add Quality Control Data</h3>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-600 mb-4">Quality control feature coming soon...</p>
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setShowQCModal(false)}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LabTechnicianDashboard;