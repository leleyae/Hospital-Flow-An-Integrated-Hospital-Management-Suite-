import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../config/api';
import {
    ShoppingCartIcon,
    BeakerIcon,
    ExclamationTriangleIcon,
    CurrencyDollarIcon,
    ClockIcon,
    ArrowTrendingUpIcon,
    UserGroupIcon,
    PlusIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const PharmacyDashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentPrescriptions, setRecentPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/pharmacy/dashboard');
            setStats(response.data.data.summary);
            setRecentPrescriptions(response.data.data.recentPrescriptions || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
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

    const statCards = [
        {
            title: 'Total Medicines',
            value: stats?.totalMedicines || 0,
            icon: BeakerIcon,
            color: 'bg-blue-500',
            textColor: 'text-blue-500',
            link: '/pharmacy/inventory'
        },
        {
            title: 'Low Stock',
            value: stats?.lowStockMedicines || 0,
            icon: ExclamationTriangleIcon,
            color: 'bg-yellow-500',
            textColor: 'text-yellow-500',
            link: '/pharmacy/inventory/low-stock'
        },
        {
            title: 'Expired Medicines',
            value: stats?.expiredMedicines || 0,
            icon: ClockIcon,
            color: 'bg-red-500',
            textColor: 'text-red-500',
            link: '/pharmacy/inventory/expired'
        },
        {
            title: "Today's Prescriptions",
            value: stats?.todayPrescriptions || 0,
            icon: UserGroupIcon,
            color: 'bg-green-500',
            textColor: 'text-green-500',
            link: '/pharmacy/prescriptions'
        },
        {
            title: "Today's Sales",
            value: `$${stats?.totalSalesToday?.toFixed(2) || '0.00'}`,
            icon: CurrencyDollarIcon,
            color: 'bg-purple-500',
            textColor: 'text-purple-500',
            link: '/pharmacy/sales'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Pharmacy Dashboard</h1>
                    <p className="text-gray-600 mt-2">Manage prescriptions, inventory, and sales</p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Link
                        to="/pharmacy/prescriptions"
                        className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-200 border-l-4 border-blue-500"
                    >
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg mr-4">
                                <ShoppingCartIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">Dispense Prescriptions</h3>
                                <p className="text-sm text-gray-500">Process patient prescriptions</p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        to="/pharmacy/inventory"
                        className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-200 border-l-4 border-green-500"
                    >
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg mr-4">
                                <BeakerIcon className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">Manage Inventory</h3>
                                <p className="text-sm text-gray-500">View and update stock</p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        to="/pharmacy/sales/otc"
                        className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-200 border-l-4 border-purple-500"
                    >
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg mr-4">
                                <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">OTC Sales</h3>
                                <p className="text-sm text-gray-500">Sell without prescription</p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        to="/pharmacy/inventory/add"
                        className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-200 border-l-4 border-indigo-500"
                    >
                        <div className="flex items-center">
                            <div className="p-2 bg-indigo-100 rounded-lg mr-4">
                                <PlusIcon className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">Add Medicine</h3>
                                <p className="text-sm text-gray-500">Add new stock to inventory</p>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    {statCards.map((stat, index) => (
                        <div key={index} className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                </div>
                                <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                                    <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                                </div>
                            </div>
                            {stat.link && (
                                <Link
                                    to={stat.link}
                                    className="inline-block mt-4 text-sm font-medium text-blue-600 hover:text-blue-800"
                                >
                                    View details →
                                </Link>
                            )}
                        </div>
                    ))}
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Recent Prescriptions</h3>
                    </div>
                    <div className="p-6">
                        {recentPrescriptions.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Prescription ID
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Patient
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {recentPrescriptions.map((prescription) => (
                                            <tr key={prescription._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {prescription.prescriptionId}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {prescription.patientId?.userId?.firstName} {prescription.patientId?.userId?.lastName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(prescription.dispensedAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    ${prescription.totalAmount?.toFixed(2) || '0.00'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${prescription.paymentStatus === 'paid'
                                                        ? 'bg-green-100 text-green-800'
                                                        : prescription.paymentStatus === 'pending'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {prescription.paymentStatus}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <ShoppingCartIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-500">No recent prescriptions</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PharmacyDashboard;