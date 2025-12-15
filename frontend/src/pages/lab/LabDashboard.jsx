// pages/lab-technician/LabTechnicianDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../config/api';
import {
    BeakerIcon,
    ClockIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    ChartBarIcon,
    CalendarIcon,
    DocumentChartBarIcon,
    UserGroupIcon,
    ArrowTrendingUpIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';

const LabTechnicianDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [recentTests, setRecentTests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await api.get('/lab-technician/dashboard');
            setStats(response.data.data);
            setRecentTests(response.data.data.recentTests || []);
        } catch (error) {
            console.error('Error fetching dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg mr-4">
                            <BeakerIcon className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Lab Technician Dashboard</h1>
                            <p className="text-gray-600 mt-2">Welcome to the laboratory management system</p>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Link
                        to="/lab-technician/tests"
                        className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-200 border-l-4 border-blue-500"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-lg font-medium text-gray-600">Total Tests</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {stats?.summary?.totalTests || 0}
                                </p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <BeakerIcon className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="flex items-center text-lg text-gray-600">
                                <CheckCircleIcon className="h-4 w-4 mr-1 text-green-500" />
                                <span>{stats?.summary?.completionRate || 0}% completion rate</span>
                            </div>
                        </div>
                    </Link>

                    <Link
                        to="/lab-technician/tests?status=pending"
                        className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-200 border-l-4 border-yellow-500"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-lg font-medium text-gray-600">Pending Tests</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {stats?.summary?.pendingTests || 0}
                                </p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <ClockIcon className="h-6 w-6 text-yellow-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="flex items-center text-lg text-gray-600">
                                <ExclamationTriangleIcon className="h-4 w-4 mr-1 text-yellow-500" />
                                <span>Require attention</span>
                            </div>
                        </div>
                    </Link>

                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-lg font-medium text-gray-600">Today's Tests</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {stats?.summary?.todayTests || 0}
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <CalendarIcon className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="flex items-center text-lg text-gray-600">
                                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                                <span>{stats?.summary?.completedToday || 0} completed today</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-lg font-medium text-gray-600">Avg. Turnaround</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {stats?.summary?.avgTurnaround || 0}h
                                </p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <ArrowPathIcon className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="flex items-center text-lg text-gray-600">
                                <ChartBarIcon className="h-4 w-4 mr-1" />
                                <span>Last 7 days average</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Quick Actions */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Link
                                        to="/lab-technician/tests"
                                        className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors duration-200"
                                    >
                                        <div className="flex items-center">
                                            <BeakerIcon className="h-5 w-5 text-blue-600 mr-3" />
                                            <div>
                                                <h4 className="font-medium text-blue-700">View All Tests</h4>
                                                <p className="text-lg text-blue-600">Manage and process lab tests</p>
                                            </div>
                                        </div>
                                    </Link>

                                    <Link
                                        to="/lab-technician/tests/add"
                                        className="p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors duration-200"
                                    >
                                        <div className="flex items-center">
                                            <CheckCircleIcon className="h-5 w-5 text-green-600 mr-3" />
                                            <div>
                                                <h4 className="font-medium text-green-700">Add Test Results</h4>
                                                <p className="text-lg text-green-600">Enter test findings and results</p>
                                            </div>
                                        </div>
                                    </Link>

                                    <Link
                                        to="/lab-technician/reports"
                                        className="p-4 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors duration-200"
                                    >
                                        <div className="flex items-center">
                                            <DocumentChartBarIcon className="h-5 w-5 text-purple-600 mr-3" />
                                            <div>
                                                <h4 className="font-medium text-purple-700">Generate Reports</h4>
                                                <p className="text-lg text-purple-600">Create and export lab reports</p>
                                            </div>
                                        </div>
                                    </Link>

                                    <Link
                                        to="/lab-technician/calendar"
                                        className="p-4 bg-orange-50 rounded-lg border border-orange-200 hover:bg-orange-100 transition-colors duration-200"
                                    >
                                        <div className="flex items-center">
                                            <CalendarIcon className="h-5 w-5 text-orange-600 mr-3" />
                                            <div>
                                                <h4 className="font-medium text-orange-700">View Schedule</h4>
                                                <p className="text-lg text-orange-600">Check upcoming tests and appointments</p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Priority Distribution */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Priority Distribution</h3>
                        </div>
                        <div className="p-6">
                            {stats?.priorityDistribution?.map((item, index) => (
                                <div key={index} className="mb-4">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-lg font-medium text-gray-700 capitalize">
                                            {item._id}
                                        </span>
                                        <span className="text-lg text-gray-600">{item.count} tests</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${item._id === 'stat' ? 'bg-red-500' :
                                                item._id === 'urgent' ? 'bg-orange-500' :
                                                    'bg-green-500'
                                                }`}
                                            style={{
                                                width: `${(item.count / (stats?.summary?.totalTests || 1)) * 100}%`
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Tests */}
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900">Recent Tests</h3>
                            <Link
                                to="/lab-technician/tests"
                                className="text-lg text-blue-600 hover:text-blue-800"
                            >
                                View all →
                            </Link>
                        </div>
                    </div>
                    <div className="p-6">
                        {recentTests.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                                                Test ID
                                            </th>
                                            <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                                                Patient
                                            </th>
                                            <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                                                Test Type
                                            </th>
                                            <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                                                Priority
                                            </th>
                                            <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                                                Requested
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {recentTests.map((test) => (
                                            <tr key={test._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 text-lg font-medium text-gray-900">
                                                    {test.testId}
                                                </td>
                                                <td className="px-6 py-4 text-lg text-gray-900">
                                                    {test.patientName || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 text-lg text-gray-600">
                                                    {test.testType}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-lg font-medium ${test.priority === 'stat' ? 'bg-red-100 text-red-800' :
                                                        test.priority === 'urgent' ? 'bg-orange-100 text-orange-800' :
                                                            'bg-green-100 text-green-800'
                                                        }`}>
                                                        {test.priority}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-lg font-medium ${test.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                        test.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                                            test.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {test.status.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-lg text-gray-600">
                                                    {new Date(test.requestedDate).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <BeakerIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-500">No recent tests found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LabTechnicianDashboard;