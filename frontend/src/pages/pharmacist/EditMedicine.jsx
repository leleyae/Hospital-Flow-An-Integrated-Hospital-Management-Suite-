// pages/pharmacy/EditMedicine.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../config/api';
import {
    PencilIcon,
    ArrowLeftIcon,
    BeakerIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    CubeIcon,
    TrashIcon
} from '@heroicons/react/24/outline';

const EditMedicine = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [stockAction, setStockAction] = useState('add');
    const [stockQuantity, setStockQuantity] = useState('');
    const [stockNotes, setStockNotes] = useState('');

    const [formData, setFormData] = useState({
        medicineName: '',
        genericName: '',
        manufacturer: '',
        batchNumber: '',
        expiryDate: '',
        quantity: '',
        unit: 'tablet',
        unitPrice: '',
        category: 'antibiotic',
        reorderLevel: '10',
        supplier: {
            name: '',
            contact: '',
            address: ''
        },
        storageConditions: '',
        description: ''
    });

    const categories = [
        { value: 'antibiotic', label: 'Antibiotic' },
        { value: 'analgesic', label: 'Analgesic (Pain Relief)' },
        { value: 'antihypertensive', label: 'Antihypertensive' },
        { value: 'diabetic', label: 'Diabetic' },
        { value: 'psychiatric', label: 'Psychiatric' },
        { value: 'other', label: 'Other' }
    ];

    const units = [
        { value: 'tablet', label: 'Tablet' },
        { value: 'capsule', label: 'Capsule' },
        { value: 'ml', label: 'Milliliter (ml)' },
        { value: 'mg', label: 'Milligram (mg)' },
        { value: 'gm', label: 'Gram (g)' },
        { value: 'injection', label: 'Injection' },
        { value: 'bottle', label: 'Bottle' }
    ];

    const stockActions = [
        { value: 'add', label: 'Add Stock', color: 'text-green-600' },
        { value: 'remove', label: 'Remove Stock', color: 'text-red-600' },
        { value: 'set', label: 'Set Stock', color: 'text-blue-600' }
    ];

    useEffect(() => {
        fetchMedicine();
    }, [id]);

    const fetchMedicine = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/pharmacy/inventory/${id}`);
            const medicine = response.data.data;

            // Format the date for input field
            const expiryDate = new Date(medicine.expiryDate).toISOString().split('T')[0];

            setFormData({
                medicineName: medicine.medicineName || '',
                genericName: medicine.genericName || '',
                manufacturer: medicine.manufacturer || '',
                batchNumber: medicine.batchNumber || '',
                expiryDate: expiryDate,
                quantity: medicine.quantity?.toString() || '0',
                unit: medicine.unit || 'tablet',
                unitPrice: medicine.unitPrice?.toString() || '0',
                category: medicine.category || 'antibiotic',
                reorderLevel: medicine.reorderLevel?.toString() || '10',
                supplier: medicine.supplier || { name: '', contact: '', address: '' },
                storageConditions: medicine.storageConditions || '',
                description: medicine.description || ''
            });
        } catch (err) {
            setError('Failed to load medicine details');
            console.error('Error fetching medicine:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSupplierChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            supplier: {
                ...formData.supplier,
                [name]: value
            }
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.medicineName || !formData.batchNumber || !formData.expiryDate) {
            setError('Please fill in all required fields');
            return;
        }

        if (parseInt(formData.quantity) < 0) {
            setError('Quantity cannot be negative');
            return;
        }

        if (parseFloat(formData.unitPrice) < 0) {
            setError('Unit price cannot be negative');
            return;
        }

        try {
            setUpdating(true);
            setError('');
            setSuccess('');

            const response = await api.put(`/pharmacy/inventory/${id}`, formData);

            setSuccess('Medicine updated successfully!');
            fetchMedicine(); // Refresh data

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update medicine');
            console.error('Error updating medicine:', err);
        } finally {
            setUpdating(false);
        }
    };

    const handleUpdateStock = async () => {
        if (!stockQuantity || parseInt(stockQuantity) < 0) {
            setError('Please enter a valid quantity');
            return;
        }

        try {
            setUpdating(true);
            setError('');
            setSuccess('');

            const response = await api.put(`/pharmacy/inventory/${id}/stock`, {
                action: stockAction,
                quantity: parseInt(stockQuantity),
                notes: stockNotes,
                batchNumber: formData.batchNumber,
                expiryDate: formData.expiryDate
            });

            setSuccess('Stock updated successfully!');
            setStockQuantity('');
            setStockNotes('');
            fetchMedicine(); // Refresh data

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update stock');
            console.error('Error updating stock:', err);
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async () => {
        try {
            setUpdating(true);
            await api.delete(`/pharmacy/inventory/${id}`);
            navigate('/pharmacy/inventory');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete medicine');
            console.error('Error deleting medicine:', err);
            setUpdating(false);
        }
    };

    const getMinimumDate = () => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-4 text-gray-600">Loading medicine details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/pharmacy/inventory')}
                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 mb-4"
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-1" />
                        Back to Inventory
                    </button>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg mr-4">
                                <PencilIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Edit Medicine</h1>
                                <p className="text-gray-600 mt-2">Update medicine details and stock</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="inline-flex items-center px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            <TrashIcon className="h-4 w-4 mr-2" />
                            Delete
                        </button>
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
                                <p className="text-sm text-green-700">{success}</p>
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
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stock Update Section */}
                <div className="bg-white rounded-lg shadow mb-6">
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Update Stock</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Action
                                </label>
                                <select
                                    value={stockAction}
                                    onChange={(e) => setStockAction(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {stockActions.map((action) => (
                                        <option key={action.value} value={action.value}>
                                            {action.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Quantity
                                </label>
                                <input
                                    type="number"
                                    value={stockQuantity}
                                    onChange={(e) => setStockQuantity(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter quantity"
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Notes
                                </label>
                                <input
                                    type="text"
                                    value={stockNotes}
                                    onChange={(e) => setStockNotes(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Stock update notes"
                                />
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={handleUpdateStock}
                                    disabled={updating || !stockQuantity}
                                    className={`w-full px-4 py-2 rounded-lg font-medium ${updating || !stockQuantity
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : stockAction === 'add'
                                            ? 'bg-green-600 text-white hover:bg-green-700'
                                            : stockAction === 'remove'
                                                ? 'bg-red-600 text-white hover:bg-red-700'
                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                >
                                    {updating ? 'Updating...' : 'Update Stock'}
                                </button>
                            </div>
                        </div>
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-center">
                                <div>
                                    <span className="text-sm font-medium text-gray-700">Current Stock:</span>
                                    <span className="ml-2 text-lg font-bold text-blue-600">
                                        {formData.quantity} {formData.unit}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-700">Reorder Level:</span>
                                    <span className="ml-2 text-lg font-medium text-yellow-600">
                                        {formData.reorderLevel} {formData.unit}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6">
                        <form onSubmit={handleUpdate}>
                            <div className="space-y-8">
                                {/* Basic Information */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                        <BeakerIcon className="h-5 w-5 mr-2 text-blue-500" />
                                        Basic Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Medicine Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="medicineName"
                                                value={formData.medicineName}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Generic Name
                                            </label>
                                            <input
                                                type="text"
                                                name="genericName"
                                                value={formData.genericName}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Manufacturer
                                            </label>
                                            <input
                                                type="text"
                                                name="manufacturer"
                                                value={formData.manufacturer}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Category
                                            </label>
                                            <select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                {categories.map((cat) => (
                                                    <option key={cat.value} value={cat.value}>
                                                        {cat.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Batch & Stock Information */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                        <CalendarIcon className="h-5 w-5 mr-2 text-green-500" />
                                        Batch & Stock Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Batch Number *
                                            </label>
                                            <input
                                                type="text"
                                                name="batchNumber"
                                                value={formData.batchNumber}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Expiry Date *
                                            </label>
                                            <input
                                                type="date"
                                                name="expiryDate"
                                                value={formData.expiryDate}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                min={getMinimumDate()}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Unit *
                                            </label>
                                            <select
                                                name="unit"
                                                value={formData.unit}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                {units.map((unit) => (
                                                    <option key={unit.value} value={unit.value}>
                                                        {unit.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Reorder Level
                                            </label>
                                            <input
                                                type="number"
                                                name="reorderLevel"
                                                value={formData.reorderLevel}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Pricing */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                        <CurrencyDollarIcon className="h-5 w-5 mr-2 text-purple-500" />
                                        Pricing
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Unit Price (USD) *
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500">$</span>
                                                </div>
                                                <input
                                                    type="number"
                                                    name="unitPrice"
                                                    value={formData.unitPrice}
                                                    onChange={handleChange}
                                                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    step="0.01"
                                                    min="0"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Supplier Information */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                        <CubeIcon className="h-5 w-5 mr-2 text-orange-500" />
                                        Supplier Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Supplier Name
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.supplier.name}
                                                onChange={handleSupplierChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Contact Number
                                            </label>
                                            <input
                                                type="text"
                                                name="contact"
                                                value={formData.supplier.contact}
                                                onChange={handleSupplierChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Address
                                            </label>
                                            <textarea
                                                name="address"
                                                value={formData.supplier.address}
                                                onChange={handleSupplierChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                rows="2"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Information */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Additional Information
                                    </h3>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Storage Conditions
                                            </label>
                                            <textarea
                                                name="storageConditions"
                                                value={formData.storageConditions}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                rows="2"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Description
                                            </label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                rows="3"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Form Actions */}
                                <div className="pt-6 border-t border-gray-200">
                                    <div className="flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => navigate('/pharmacy/inventory')}
                                            className="px-6 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={updating}
                                            className={`px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${updating
                                                ? 'bg-blue-400 cursor-not-allowed'
                                                : 'bg-blue-600 hover:bg-blue-700'
                                                }`}
                                        >
                                            {updating ? (
                                                <span className="flex items-center">
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                    Updating...
                                                </span>
                                            ) : (
                                                <span className="flex items-center">
                                                    <PencilIcon className="h-4 w-4 mr-2" />
                                                    Update Medicine
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Delete Medicine</h3>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                            </div>
                            <h4 className="text-lg font-medium text-gray-900 text-center mb-2">Are you sure?</h4>
                            <p className="text-sm text-gray-500 text-center mb-4">
                                You are about to delete <strong>{formData.medicineName}</strong>. This action cannot be undone.
                            </p>
                            <div className="text-center bg-red-50 p-3 rounded-lg mb-4">
                                <p className="text-sm text-red-600">
                                    Current Stock: {formData.quantity} {formData.unit}
                                </p>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                disabled={updating}
                                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={updating}
                                className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:bg-red-400"
                            >
                                {updating ? 'Deleting...' : 'Delete Medicine'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditMedicine;