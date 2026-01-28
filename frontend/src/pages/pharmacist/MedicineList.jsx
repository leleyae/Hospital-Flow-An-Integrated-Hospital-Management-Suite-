// pages/pharmacy/MedicineList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../config/api';
import {
    MagnifyingGlassIcon,
    PlusIcon,
    FunnelIcon,
    ArrowPathIcon,
    ExclamationTriangleIcon,
    ClockIcon,
    EyeIcon,
    PencilIcon
} from '@heroicons/react/24/outline';

const MedicineList = () => {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [inStockFilter, setInStockFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [lowStockCount, setLowStockCount] = useState(0);
    const [expiredCount, setExpiredCount] = useState(0);

    const categories = [
        'antibiotic',
        'analgesic',
        'antihypertensive',
        'diabetic',
        'psychiatric',
        'other'
    ];

    useEffect(() => {
        fetchMedicines();
        fetchStats();
    }, [currentPage, categoryFilter, inStockFilter]);

    const fetchMedicines = async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                limit: 20,
                ...(categoryFilter && { category: categoryFilter }),
                ...(inStockFilter !== 'all' && { inStock: inStockFilter })
            };

            const response = await api.get('/pharmacy/inventory', { params });
            setMedicines(response.data.data);
            setTotalPages(response.data.pagination?.pages || 1);
            setTotalItems(response.data.pagination?.total || 0);
        } catch (error) {
            console.error('Error fetching medicines:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const [lowStockRes, expiredRes] = await Promise.all([
                api.get('/pharmacy/inventory/low-stock'),
                api.get('/pharmacy/inventory/expired')
            ]);

            setLowStockCount(lowStockRes.data.count || 0);
            setExpiredCount(expiredRes.data.count || 0);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchMedicines();
    };

    const handleRefresh = () => {
        setCurrentPage(1);
        fetchMedicines();
        fetchStats();
    };

    const getCategoryColor = (category) => {
        const colors = {
            antibiotic: 'bg-blue-100 text-blue-800',
            analgesic: 'bg-purple-100 text-purple-800',
            antihypertensive: 'bg-green-100 text-green-800',
            diabetic: 'bg-yellow-100 text-yellow-800',
            psychiatric: 'bg-pink-100 text-pink-800',
            other: 'bg-gray-100 text-gray-800'
        };
        return colors[category] || colors.other;
    };

    const getStockStatus = (quantity, reorderLevel) => {
        if (quantity === 0) return { text: 'Out of Stock', color: 'bg-red-100 text-red-800' };
        if (quantity <= reorderLevel) return { text: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
        return { text: 'In Stock', color: 'bg-green-100 text-green-800' };
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const isExpired = (expiryDate) => {
        return new Date(expiryDate) < new Date();
    };

    if (loading && medicines.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-4 text-gray-600">Loading medicines...</p>
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
                            <h1 className="text-3xl font-bold text-gray-900">Medicine List</h1>
                            <p className="text-gray-600 mt-2">Manage pharmacy inventory</p>
                        </div>
                        <div className="mt-4 md:mt-0 flex space-x-3">
                            <Link
                                to="/pharmacy/inventory/add"
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <PlusIcon className="h-5 w-5 mr-2" />
                                Add Medicine
                            </Link>
                            <button
                                onClick={handleRefresh}
<<<<<<< HEAD
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-lg font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
=======
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                            >
                                <ArrowPathIcon className="h-4 w-4 mr-2" />
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Link
                        to="/pharmacy/inventory?inStock=false"
                        className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-200 border-l-4 border-red-500"
                    >
                        <div className="flex items-center">
                            <div className="p-2 bg-red-100 rounded-lg mr-4">
                                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">Out of Stock</h3>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {medicines.filter(m => m.quantity === 0).length}
                                </p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        to="/pharmacy/inventory/low-stock"
                        className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-200 border-l-4 border-yellow-500"
                    >
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg mr-4">
                                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">Low Stock</h3>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{lowStockCount}</p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        to="/pharmacy/inventory/expired"
                        className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-200 border-l-4 border-gray-500"
                    >
                        <div className="flex items-center">
                            <div className="p-2 bg-gray-100 rounded-lg mr-4">
                                <ClockIcon className="h-6 w-6 text-gray-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">Expired</h3>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{expiredCount}</p>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                        <form onSubmit={handleSearch} className="flex-1">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Search medicines by name, generic name, or manufacturer"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </form>

                        <div className="flex space-x-4">
                            <select
                                className="block w-full md:w-auto pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </option>
                                ))}
                            </select>

                            <select
                                className="block w-full md:w-auto pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                                value={inStockFilter}
                                onChange={(e) => setInStockFilter(e.target.value)}
                            >
                                <option value="all">All Stock</option>
                                <option value="true">In Stock Only</option>
                                <option value="false">Out of Stock</option>
                            </select>

                            <button
                                onClick={handleSearch}
<<<<<<< HEAD
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-lg font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
=======
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                            >
                                <FunnelIcon className="h-4 w-4 mr-2" />
                                Filter
                            </button>
                        </div>
                    </div>
                </div>

                {/* Medicines Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">
                                Medicines ({totalItems})
                            </h3>
<<<<<<< HEAD
                            <div className="text-lg text-gray-500">
=======
                            <div className="text-sm text-gray-500">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                Page {currentPage} of {totalPages}
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
<<<<<<< HEAD
                                    <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                                        Medicine
                                    </th>
                                    <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                                        Batch & Expiry
                                    </th>
                                    <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                                        Stock
                                    </th>
                                    <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
=======
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Medicine
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Batch & Expiry
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Stock
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {medicines.map((medicine) => {
                                    const stockStatus = getStockStatus(medicine.quantity, medicine.reorderLevel);
                                    const expired = isExpired(medicine.expiryDate);

                                    return (
                                        <tr key={medicine._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div>
<<<<<<< HEAD
                                                    <div className="text-lg font-medium text-gray-900">
                                                        {medicine.medicineName}
                                                    </div>
                                                    <div className="text-lg text-gray-500">
                                                        {medicine.genericName}
                                                    </div>
                                                    <div className="text-lg text-gray-400">
=======
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {medicine.medicineName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {medicine.genericName}
                                                    </div>
                                                    <div className="text-xs text-gray-400">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                        ID: {medicine.medicineId}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
<<<<<<< HEAD
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-lg font-medium ${getCategoryColor(medicine.category)}`}>
=======
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(medicine.category)}`}>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                    {medicine.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
<<<<<<< HEAD
                                                <div className="text-lg text-gray-900">
                                                    {medicine.batchNumber}
                                                </div>
                                                <div className={`text-lg ${expired ? 'text-red-600' : 'text-gray-500'}`}>
                                                    Exp: {formatDate(medicine.expiryDate)}
                                                    {expired && (
                                                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-lg font-medium bg-red-100 text-red-800">
=======
                                                <div className="text-sm text-gray-900">
                                                    {medicine.batchNumber}
                                                </div>
                                                <div className={`text-sm ${expired ? 'text-red-600' : 'text-gray-500'}`}>
                                                    Exp: {formatDate(medicine.expiryDate)}
                                                    {expired && (
                                                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                            Expired
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
<<<<<<< HEAD
                                                <div className="text-lg font-medium text-gray-900">
                                                    {medicine.quantity} {medicine.unit}
                                                </div>
                                                <div className="mt-1">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-lg font-medium ${stockStatus.color}`}>
=======
                                                <div className="text-sm font-medium text-gray-900">
                                                    {medicine.quantity} {medicine.unit}
                                                </div>
                                                <div className="mt-1">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.color}`}>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                        {stockStatus.text}
                                                    </span>
                                                </div>
                                                {medicine.quantity <= medicine.reorderLevel && medicine.quantity > 0 && (
<<<<<<< HEAD
                                                    <div className="mt-1 text-lg text-yellow-600">
=======
                                                    <div className="mt-1 text-xs text-yellow-600">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                        Reorder at: {medicine.reorderLevel}
                                                    </div>
                                                )}
                                            </td>
<<<<<<< HEAD
                                            <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-900">
                                                ${medicine.unitPrice?.toFixed(2) || '0.00'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-lg font-medium">
=======
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                ${medicine.unitPrice?.toFixed(2) || '0.00'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                <div className="flex space-x-2">
                                                    <Link
                                                        to={`/pharmacy/inventory/${medicine._id}`}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        <EyeIcon className="h-4 w-4 inline" />
                                                    </Link>
                                                    <Link
                                                        to={`/pharmacy/inventory/${medicine._id}/edit`}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        <PencilIcon className="h-4 w-4 inline" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {medicines.length === 0 && (
                        <div className="text-center py-12">
                            <div className="mx-auto h-12 w-12 text-gray-400">
                                <BeakerIcon className="h-12 w-12" />
                            </div>
<<<<<<< HEAD
                            <h3 className="mt-2 text-lg font-medium text-gray-900">No medicines found</h3>
                            <p className="mt-1 text-lg text-gray-500">
=======
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No medicines found</h3>
                            <p className="mt-1 text-sm text-gray-500">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                {categoryFilter || inStockFilter !== 'all' || searchTerm
                                    ? 'Try changing your filters or search term'
                                    : 'Get started by adding a new medicine to inventory'}
                            </p>
                            {!categoryFilter && inStockFilter === 'all' && !searchTerm && (
                                <div className="mt-6">
                                    <Link
                                        to="/pharmacy/inventory/add"
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                                    >
                                        <PlusIcon className="h-4 w-4 mr-2" />
                                        Add Medicine
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <div className="flex items-center justify-between">
<<<<<<< HEAD
                                <div className="text-lg text-gray-700">
=======
                                <div className="text-sm text-gray-700">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                    Showing page {currentPage} of {totalPages}
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className={`px-3 py-1 rounded-lg ${currentPage === 1
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                            }`}
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className={`px-3 py-1 rounded-lg ${currentPage === totalPages
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                            }`}
                                    >
                                        Next
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

export default MedicineList;