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
    BeakerIcon
} from '@heroicons/react/24/outline';

const PharmacyInventory = () => {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [inStockFilter, setInStockFilter] = useState('all');
    const [stats, setStats] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const categories = [
        'antibiotic',
        'analgesic',
        'antihypertensive',
        'diabetic',
        'psychiatric',
        'other'
    ];

    useEffect(() => {
        fetchInventory();
    }, [currentPage, categoryFilter, inStockFilter]);

    const fetchInventory = async () => {
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
            setStats(response.data.stats);
            setTotalPages(response.data.pagination.pages);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchInventory();
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

    const handleUpdateStock = async (medicineId, action, quantity) => {
        try {
            await api.put(`/pharmacy/inventory/${medicineId}/stock`, {
                action,
                quantity: parseInt(quantity)
            });
            fetchInventory();
        } catch (error) {
            console.error('Error updating stock:', error);
        }
    };

    if (loading && medicines.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-4 text-gray-600">Loading inventory...</p>
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
                            <h1 className="text-3xl font-bold text-gray-900">Pharmacy Inventory</h1>
                            <p className="text-gray-600 mt-2">Manage medicine stock and inventory</p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <Link
                                to="/pharmacy/inventory/add"
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <PlusIcon className="h-5 w-5 mr-2" />
                                Add Medicine
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-blue-100 rounded-lg mr-4">
                                    <BeakerIcon className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Items</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-yellow-100 rounded-lg mr-4">
                                    <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.lowStock}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-green-100 rounded-lg mr-4">
                                    <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Inventory Value</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        ${stats.totalValue?.toFixed(2) || '0.00'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

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
                                onClick={fetchInventory}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <ArrowPathIcon className="h-4 w-4 mr-2" />
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>

                {/* Inventory Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
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
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {medicines.map((medicine) => {
                                    const stockStatus = getStockStatus(medicine.quantity, medicine.reorderLevel);
                                    const isExpired = new Date(medicine.expiryDate) < new Date();

                                    return (
                                        <tr key={medicine._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {medicine.medicineName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {medicine.genericName}
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                        ID: {medicine.medicineId}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(medicine.category)}`}>
                                                    {medicine.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {medicine.batchNumber}
                                                </div>
                                                <div className={`text-sm ${isExpired ? 'text-red-600' : 'text-gray-500'}`}>
                                                    Exp: {new Date(medicine.expiryDate).toLocaleDateString()}
                                                    {isExpired && (
                                                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                                            Expired
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {medicine.quantity} {medicine.unit}
                                                </div>
                                                <div className="mt-1">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.color}`}>
                                                        {stockStatus.text}
                                                    </span>
                                                </div>
                                                {medicine.quantity <= medicine.reorderLevel && (
                                                    <div className="mt-1 text-xs text-yellow-600">
                                                        Reorder at: {medicine.reorderLevel} {medicine.unit}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                ${medicine.unitPrice?.toFixed(2) || '0.00'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleUpdateStock(medicine._id, 'add', 10)}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        Add Stock
                                                    </button>
                                                    <Link
                                                        to={`/pharmacy/inventory/${medicine._id}/edit`}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        Edit
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700">
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

export default PharmacyInventory;