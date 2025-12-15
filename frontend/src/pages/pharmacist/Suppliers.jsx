// src/pages/pharmacist/Suppliers.jsx
import { useState, useEffect } from 'react';
import {
    FaBuilding,
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaPlus,
    FaEdit,
    FaTrash,
    FaSearch,
} from 'react-icons/fa';
import { pharmacistService } from '../../services/pharmacist.service';

const Suppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);

    const [newSupplier, setNewSupplier] = useState({
        name: '',
        contact: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        notes: ''
    });

    useEffect(() => {
        loadSuppliers();
    }, []);

    const loadSuppliers = async () => {
        try {
            setLoading(true);
            const data = await pharmacistService.getAllSuppliers();
            setSuppliers(data.data?.suppliers || []);
        } catch (error) {
            console.error('Error loading suppliers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSupplier = async () => {
        try {
            await pharmacistService.addSupplier(newSupplier);
            setShowAddModal(false);
            resetNewSupplier();
            loadSuppliers();
        } catch (error) {
            console.error('Error adding supplier:', error);
            alert(error.response?.data?.message || 'Failed to add supplier');
        }
    };

    const handleUpdateSupplier = async () => {
        if (!selectedSupplier) return;

        try {
            await pharmacistService.updateSupplier(selectedSupplier.id || selectedSupplier._id, {
                name: selectedSupplier.name,
                contact: selectedSupplier.contact,
                address: selectedSupplier.address,
                email: selectedSupplier.email,
                phone: selectedSupplier.phone
            });
            setShowEditModal(false);
            loadSuppliers();
        } catch (error) {
            console.error('Error updating supplier:', error);
            alert(error.response?.data?.message || 'Failed to update supplier');
        }
    };

    const handleDeleteSupplier = async (supplierId) => {
        if (window.confirm('Are you sure you want to delete this supplier?')) {
            try {
                await pharmacistService.deleteSupplier(supplierId);
                loadSuppliers();
            } catch (error) {
                console.error('Error deleting supplier:', error);
                alert(error.response?.data?.message || 'Failed to delete supplier');
            }
        }
    };

    const resetNewSupplier = () => {
        setNewSupplier({
            name: '',
            contact: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            notes: ''
        });
    };

    const filteredSuppliers = suppliers.filter(supplier =>
        supplier.name?.toLowerCase().includes(search.toLowerCase()) ||
        supplier.contact?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Suppliers</h1>
                    <p className="text-gray-600">Manage medicine suppliers and vendors</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <FaPlus className="mr-2" />
                    Add Supplier
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search suppliers by name or contact..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Suppliers Grid */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            ) : filteredSuppliers.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <FaBuilding className="mx-auto text-gray-400 text-4xl mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No suppliers found</h3>
                    <p className="text-gray-500 mb-4">Add your first supplier to get started</p>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Add Supplier
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSuppliers.map((supplier, index) => (
                        <div key={index} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                            <div className="p-6">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                            <FaBuilding className="text-blue-600 text-xl" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{supplier.name}</h3>
                                            <p className="text-lg text-gray-500">{supplier.contact}</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => {
                                                setSelectedSupplier(supplier);
                                                setShowEditModal(true);
                                            }}
                                            className="text-blue-600 hover:text-blue-900 p-1"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteSupplier(supplier.id || supplier._id)}
                                            className="text-red-600 hover:text-red-900 p-1"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="space-y-3">
                                    {supplier.email && (
                                        <div className="flex items-center text-lg">
                                            <FaEnvelope className="text-gray-400 mr-2" />
                                            <span className="text-gray-700">{supplier.email}</span>
                                        </div>
                                    )}

                                    {supplier.phone && (
                                        <div className="flex items-center text-lg">
                                            <FaPhone className="text-gray-400 mr-2" />
                                            <span className="text-gray-700">{supplier.phone}</span>
                                        </div>
                                    )}

                                    {supplier.address && (
                                        <div className="flex items-start text-lg">
                                            <FaMapMarkerAlt className="text-gray-400 mr-2 mt-0.5" />
                                            <span className="text-gray-700">{supplier.address}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Stats */}
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="flex justify-between text-lg">
                                        <div className="text-center">
                                            <div className="font-medium text-gray-900">
                                                {supplier.totalMedicines || 0}
                                            </div>
                                            <div className="text-gray-500">Medicines</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="font-medium text-gray-900">
                                                {supplier.lastOrderDate ? 'Active' : 'No orders'}
                                            </div>
                                            <div className="text-gray-500">Status</div>
                                        </div>
                                        <div className="text-center">
                                            <button className="text-blue-600 hover:text-blue-800 font-medium">
                                                View Orders →
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Supplier Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Add New Supplier</h3>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-1">Company Name *</label>
                                    <input
                                        type="text"
                                        value={newSupplier.name}
                                        onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-1">Contact Person</label>
                                    <input
                                        type="text"
                                        value={newSupplier.contact}
                                        onChange={(e) => setNewSupplier({ ...newSupplier, contact: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={newSupplier.email}
                                        onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        value={newSupplier.phone}
                                        onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-lg font-medium text-gray-700 mb-1">Address</label>
                                    <input
                                        type="text"
                                        value={newSupplier.address}
                                        onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-1">City</label>
                                    <input
                                        type="text"
                                        value={newSupplier.city}
                                        onChange={(e) => setNewSupplier({ ...newSupplier, city: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-1">State</label>
                                    <input
                                        type="text"
                                        value={newSupplier.state}
                                        onChange={(e) => setNewSupplier({ ...newSupplier, state: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-1">Zip Code</label>
                                    <input
                                        type="text"
                                        value={newSupplier.zipCode}
                                        onChange={(e) => setNewSupplier({ ...newSupplier, zipCode: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-lg font-medium text-gray-700 mb-1">Notes</label>
                                    <textarea
                                        value={newSupplier.notes}
                                        onChange={(e) => setNewSupplier({ ...newSupplier, notes: e.target.value })}
                                        rows="3"
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
                                    onClick={handleAddSupplier}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Add Supplier
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Supplier Modal */}
            {showEditModal && selectedSupplier && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Edit Supplier</h3>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-1">Company Name</label>
                                    <input
                                        type="text"
                                        value={selectedSupplier.name || ''}
                                        onChange={(e) => setSelectedSupplier({ ...selectedSupplier, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-1">Contact Person</label>
                                    <input
                                        type="text"
                                        value={selectedSupplier.contact || ''}
                                        onChange={(e) => setSelectedSupplier({ ...selectedSupplier, contact: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={selectedSupplier.email || ''}
                                        onChange={(e) => setSelectedSupplier({ ...selectedSupplier, email: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        value={selectedSupplier.phone || ''}
                                        onChange={(e) => setSelectedSupplier({ ...selectedSupplier, phone: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-1">Address</label>
                                    <input
                                        type="text"
                                        value={selectedSupplier.address || ''}
                                        onChange={(e) => setSelectedSupplier({ ...selectedSupplier, address: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
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
                                    onClick={handleUpdateSupplier}
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

export default Suppliers;