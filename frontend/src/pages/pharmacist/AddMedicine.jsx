// pages/pharmacy/AddMedicine.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/api';
import {
    PlusIcon,
    ArrowLeftIcon,
    BeakerIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    CubeIcon
} from '@heroicons/react/24/outline';

const AddMedicine = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.medicineName || !formData.batchNumber || !formData.expiryDate ||
            !formData.quantity || !formData.unitPrice) {
            setError('Please fill in all required fields');
            return;
        }

        if (parseInt(formData.quantity) < 0) {
            setError('Quantity cannot be negative');
            return;
        }

        if (parseFloat(formData.unitPrice) <= 0) {
            setError('Unit price must be greater than 0');
            return;
        }

        try {
            setLoading(true);
            setError('');
            setSuccess('');

            const response = await api.post('/pharmacy/inventory', formData);

            setSuccess('Medicine added successfully!');

            // Reset form after successful submission
            setTimeout(() => {
                navigate('/pharmacy/inventory');
            }, 1500);

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add medicine');
            console.error('Error adding medicine:', err);
        } finally {
            setLoading(false);
        }
    };

    const getMinimumDate = () => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

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

                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg mr-4">
                            <PlusIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Add New Medicine</h1>
                            <p className="text-gray-600 mt-2">Add new stock to pharmacy inventory</p>
                        </div>
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

                {/* Form */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6">
                        <form onSubmit={handleSubmit}>
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
                                                placeholder="e.g., Paracetamol"
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
                                                placeholder="e.g., Acetaminophen"
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
                                                placeholder="e.g., ABC Pharmaceuticals"
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
                                                placeholder="e.g., BATCH-2024-001"
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
                                                Quantity *
                                            </label>
                                            <input
                                                type="number"
                                                name="quantity"
                                                value={formData.quantity}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="e.g., 100"
                                                min="0"
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
                                    </div>
                                </div>

                                {/* Pricing & Reorder */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                        <CurrencyDollarIcon className="h-5 w-5 mr-2 text-purple-500" />
                                        Pricing & Reorder Settings
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
                                                    placeholder="0.00"
                                                    step="0.01"
                                                    min="0"
                                                    required
                                                />
                                            </div>
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
                                                placeholder="e.g., 10"
                                                min="0"
                                            />
                                            <p className="mt-1 text-xs text-gray-500">
                                                Alert when stock reaches this level
                                            </p>
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
                                                placeholder="Supplier company name"
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
                                                placeholder="Phone number"
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
                                                placeholder="Supplier address"
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
                                                placeholder="e.g., Store in a cool, dry place below 25°C"
                                            />
                                            <p className="mt-1 text-xs text-gray-500">
                                                Special storage instructions
                                            </p>
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
                                                placeholder="Additional description or notes about this medicine"
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
                                            disabled={loading}
                                            className={`px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading
                                                ? 'bg-blue-400 cursor-not-allowed'
                                                : 'bg-blue-600 hover:bg-blue-700'
                                                }`}
                                        >
                                            {loading ? (
                                                <span className="flex items-center">
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                    Adding...
                                                </span>
                                            ) : (
                                                <span className="flex items-center">
                                                    <PlusIcon className="h-4 w-4 mr-2" />
                                                    Add Medicine to Inventory
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
        </div>
    );
};

export default AddMedicine;