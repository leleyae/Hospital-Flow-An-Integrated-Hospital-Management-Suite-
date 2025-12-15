// src/pages/pharmacist/Inventory.jsx
import { useState, useEffect } from 'react';
import {
    FaSearch,
    FaPlus,
    FaEdit,
    FaTrash,
    FaExclamationTriangle,
    FaCalendarTimes,

} from 'react-icons/fa';
import { pharmacistService } from '../../services/pharmacist.service';

const Inventory = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [manufacturer, setManufacturer] = useState('');
    const [lowStock, setLowStock] = useState(false);
    const [expiringSoon, setExpiringSoon] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [categories] = useState(['antibiotic', 'analgesic', 'antihypertensive', 'diabetic', 'psychiatric', 'other']);

    const [newItem, setNewItem] = useState({
        medicineName: '',
        genericName: '',
        manufacturer: '',
        batchNumber: '',
        expiryDate: '',
        quantity: 0,
        unit: 'tablet',
        unitPrice: 0,
        category: '',
        reorderLevel: 10,
        supplier: { name: '', contact: '', address: '' },
        storageConditions: '',
        description: ''
    });

    useEffect(() => {
        loadInventory();
    }, [page, category, manufacturer, lowStock, expiringSoon]);

    const loadInventory = async () => {
        try {
            setLoading(true);
            const params = {
                page,
                limit: 10,
                search,
                category,
                manufacturer,
                lowStock: lowStock ? 'true' : undefined,
                expiringSoon: expiringSoon ? 'true' : undefined
            };

            const data = await pharmacistService.getAllInventory(params);
            setInventory(data.data?.inventory || []);
            setTotalPages(data.data?.pagination?.pages || 1);
        } catch (error) {
            console.error('Error loading inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = async () => {
        try {
            await pharmacistService.addToInventory(newItem);
            setShowAddModal(false);
            resetNewItem();
            loadInventory();
        } catch (error) {
            console.error('Error adding item:', error);
            alert(error.response?.data?.message || 'Failed to add item');
        }
    };

    const handleUpdateItem = async () => {
        try {
            await pharmacistService.updateInventoryItem(selectedItem._id, {
                medicineName: selectedItem.medicineName,
                genericName: selectedItem.genericName,
                unitPrice: selectedItem.unitPrice,
                category: selectedItem.category,
                reorderLevel: selectedItem.reorderLevel,
                isActive: selectedItem.isActive
            });
            setShowEditModal(false);
            loadInventory();
        } catch (error) {
            console.error('Error updating item:', error);
            alert(error.response?.data?.message || 'Failed to update item');
        }
    };

    const handleDeleteItem = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await pharmacistService.deleteInventoryItem(id);
                loadInventory();
            } catch (error) {
                console.error('Error deleting item:', error);
                alert(error.response?.data?.message || 'Failed to delete item');
            }
        }
    };

    const handleUpdateQuantity = async (id, adjustmentType, quantity) => {
        try {
            await pharmacistService.updateQuantity(id, {
                quantity,
                adjustmentType,
                reason: 'Manual adjustment'
            });
            loadInventory();
        } catch (error) {
            console.error('Error updating quantity:', error);
            alert(error.response?.data?.message || 'Failed to update quantity');
        }
    };

    const resetNewItem = () => {
        setNewItem({
            medicineName: '',
            genericName: '',
            manufacturer: '',
            batchNumber: '',
            expiryDate: '',
            quantity: 0,
            unit: 'tablet',
            unitPrice: 0,
            category: '',
            reorderLevel: 10,
            supplier: { name: '', contact: '', address: '' },
            storageConditions: '',
            description: ''
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const getStockStatus = (quantity, reorderLevel) => {
        if (quantity === 0) return { color: 'bg-red-100 text-red-800', text: 'Out of Stock' };
        if (quantity <= reorderLevel) return { color: 'bg-yellow-100 text-yellow-800', text: 'Low Stock' };
        return { color: 'bg-green-100 text-green-800', text: 'In Stock' };
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
                    <p className="text-gray-600">Manage your pharmacy stock and medications</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <FaPlus className="mr-2" />
                    Add New Item
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-1">Search</label>
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search medicines..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && loadInventory()}
                                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-1">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-1">Filters</label>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setLowStock(!lowStock)}
                                className={`px-3 py-2 rounded-lg flex items-center ${lowStock ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-700'}`}
                            >
                                <FaExclamationTriangle className="mr-1" />
                                Low Stock
                            </button>
                            <button
                                onClick={() => setExpiringSoon(!expiringSoon)}
                                className={`px-3 py-2 rounded-lg flex items-center ${expiringSoon ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'}`}
                            >
                                <FaCalendarTimes className="mr-1" />
                                Expiring
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-1">Actions</label>
                        <button
                            onClick={loadInventory}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <>
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
                                            Stock
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Expiry
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {inventory.map((item) => {
                                        const stockStatus = getStockStatus(item.quantity, item.reorderLevel);
                                        const isExpiringSoon = new Date(item.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

                                        return (
                                            <tr key={item._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="font-medium text-gray-900">{item.medicineName}</div>
                                                        <div className="text-lg text-gray-500">{item.medicineId}</div>
                                                        {item.genericName && (
                                                            <div className="text-xs text-gray-400">{item.genericName}</div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                        {item.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-lg text-gray-900">{item.quantity} {item.unit}</div>
                                                    <div className="text-xs text-gray-500">Reorder: {item.reorderLevel}</div>
                                                    <div className="flex space-x-2 mt-1">
                                                        <button
                                                            onClick={() => handleUpdateQuantity(item._id, 'add', 10)}
                                                            className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200"
                                                        >
                                                            +10
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateQuantity(item._id, 'remove', 1)}
                                                            className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
                                                        >
                                                            -1
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-900">
                                                    {formatCurrency(item.unitPrice)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className={`text-lg ${isExpiringSoon ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                                                        {new Date(item.expiryDate).toLocaleDateString()}
                                                    </div>
                                                    {isExpiringSoon && (
                                                        <div className="text-xs text-red-500">
                                                            Expiring soon!
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${stockStatus.color}`}>
                                                        {stockStatus.text}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-lg font-medium">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedItem(item);
                                                                setShowEditModal(true);
                                                            }}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteItem(item._id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            <FaTrash />
                                                        </button>
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
                            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                                <div className="flex justify-between">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className={`px-3 py-1 rounded ${page === 1 ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                                    >
                                        Previous
                                    </button>
                                    <div className="flex items-center">
                                        <span className="text-lg text-gray-700">
                                            Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className={`px-3 py-1 rounded ${page === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Add New Medicine</h3>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-1">Medicine Name *</label>
                                    <input
                                        type="text"
                                        value={newItem.medicineName}
                                        onChange={(e) => setNewItem({ ...newItem, medicineName: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-1">Generic Name</label>
                                    <input
                                        type="text"
                                        value={newItem.genericName}
                                        onChange={(e) => setNewItem({ ...newItem, genericName: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-1">Manufacturer *</label>
                                    <input
                                        type="text"
                                        value={newItem.manufacturer}
                                        onChange={(e) => setNewItem({ ...newItem, manufacturer: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-1">Batch Number *</label>
                                    <input
                                        type="text"
                                        value={newItem.batchNumber}
                                        onChange={(e) => setNewItem({ ...newItem, batchNumber: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-1">Expiry Date *</label>
                                    <input
                                        type="date"
                                        value={newItem.expiryDate}
                                        onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-1">Quantity *</label>
                                    <input
                                        type="number"
                                        value={newItem.quantity}
                                        onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-1">Unit *</label>
                                    <select
                                        value={newItem.unit}
                                        onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="tablet">Tablet</option>
                                        <option value="capsule">Capsule</option>
                                        <option value="ml">ml</option>
                                        <option value="mg">mg</option>
                                        <option value="gm">gm</option>
                                        <option value="injection">Injection</option>
                                        <option value="bottle">Bottle</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-1">Unit Price *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={newItem.unitPrice}
                                        onChange={(e) => setNewItem({ ...newItem, unitPrice: parseFloat(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        value={newItem.category}
                                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-1">Reorder Level</label>
                                    <input
                                        type="number"
                                        value={newItem.reorderLevel}
                                        onChange={(e) => setNewItem({ ...newItem, reorderLevel: parseInt(e.target.value) || 10 })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-lg font-medium text-gray-700 mb-1">Supplier Name</label>
                                    <input
                                        type="text"
                                        value={newItem.supplier.name}
                                        onChange={(e) => setNewItem({
                                            ...newItem,
                                            supplier: { ...newItem.supplier, name: e.target.value }
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-1">Storage Conditions</label>
                                    <input
                                        type="text"
                                        value={newItem.storageConditions}
                                        onChange={(e) => setNewItem({ ...newItem, storageConditions: e.target.value })}
                                        placeholder="e.g., Store at 2-8°C"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-1">Description</label>
                                    <input
                                        type="text"
                                        value={newItem.description}
                                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddItem}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Add Medicine
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && selectedItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Edit Medicine</h3>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-1">Medicine Name</label>
                                    <input
                                        type="text"
                                        value={selectedItem.medicineName}
                                        onChange={(e) => setSelectedItem({ ...selectedItem, medicineName: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-1">Generic Name</label>
                                    <input
                                        type="text"
                                        value={selectedItem.genericName || ''}
                                        onChange={(e) => setSelectedItem({ ...selectedItem, genericName: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-1">Unit Price ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={selectedItem.unitPrice}
                                        onChange={(e) => setSelectedItem({ ...selectedItem, unitPrice: parseFloat(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-1">Reorder Level</label>
                                    <input
                                        type="number"
                                        value={selectedItem.reorderLevel}
                                        onChange={(e) => setSelectedItem({ ...selectedItem, reorderLevel: parseInt(e.target.value) || 10 })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        value={selectedItem.category}
                                        onChange={(e) => setSelectedItem({ ...selectedItem, category: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        checked={selectedItem.isActive}
                                        onChange={(e) => setSelectedItem({ ...selectedItem, isActive: e.target.checked })}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="isActive" className="ml-2 text-lg text-gray-700">
                                        Active in inventory
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateItem}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;