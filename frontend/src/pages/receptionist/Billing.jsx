// src/pages/receptionist/Billing.jsx
import { useState, useEffect } from 'react';
import {
    FaMoneyBillWave,
    FaSearch,
    FaPlus,
    FaEye,
    FaPrint,
    FaCheckCircle,
    FaClock,
    FaExclamationTriangle,
    FaTrash,
} from 'react-icons/fa';
import receptionistService from '../../services/receptionist.service';


const Billing = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [patients, setPatients] = useState([]);

    const [newInvoice, setNewInvoice] = useState({
        patientId: '',
        items: [{ description: '', quantity: 1, amount: 0 }],
        paymentMethod: '',
        notes: ''
    });

    const [paymentData, setPaymentData] = useState({
        amount: 0,
        paymentMethod: 'cash',
        transactionId: '',
        notes: ''
    });

    useEffect(() => {
        loadBilling();
        loadPatients();
    }, [statusFilter]);


    const loadBilling = async () => {
        try {
            setLoading(true);
            const data = await receptionistService.getBilling({
                search,
                status: statusFilter !== 'all' ? statusFilter : undefined
            });
            setInvoices(data.data.invoices);
        } catch (error) {
            console.error('Error loading billing:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadPatients = async () => {
        try {
            const data = await receptionistService.getPatients();
            setPatients(data.data.patients);
        } catch (error) {
            console.error('Error loading patients:', error);
        }
    };

    const handleCreateInvoice = async () => {
        try {
            const totalAmount = newInvoice.items.reduce((sum, item) => sum + (item.amount * item.quantity), 0);

            const invoiceData = {
                patientId: newInvoice.patientId,
                patientName: patients.find(p => p.id === newInvoice.patientId)?.firstName + ' ' +
                    patients.find(p => p.id === newInvoice.patientId)?.lastName,
                items: newInvoice.items,
                totalAmount,
                paymentMethod: newInvoice.paymentMethod,
                status: 'pending',
                notes: newInvoice.notes
            };

            await receptionistService.createInvoice(invoiceData);
            setShowNewInvoiceModal(false);
            resetNewInvoice();
            loadBilling();
            alert('Invoice created successfully!');
        } catch (error) {
            console.error('Error creating invoice:', error);
            alert('Failed to create invoice');
        }
    };

    const handleUpdateInvoiceStatus = async (invoiceId, status, paymentMethod = null) => {
        try {
            await receptionistService.updateInvoiceStatus(invoiceId, status, paymentMethod);
            loadBilling();
            alert(`Invoice marked as ${status}`);
        } catch (error) {
            console.error('Error updating invoice:', error);
            alert('Failed to update invoice status');
        }
    };

    const handleProcessPayment = async () => {
        if (!selectedInvoice) return;

        try {
            await receptionistService.updateInvoiceStatus(
                selectedInvoice.id,
                paymentData.amount >= selectedInvoice.totalAmount ? 'paid' : 'partial',
                paymentData.paymentMethod
            );
            setShowPaymentModal(false);
            loadBilling();
            alert('Payment processed successfully!');
        } catch (error) {
            console.error('Error processing payment:', error);
            alert('Failed to process payment');
        }
    };

    const resetNewInvoice = () => {
        setNewInvoice({
            patientId: '',
            items: [{ description: '', quantity: 1, amount: 0 }],
            paymentMethod: '',
            notes: ''
        });
    };

    const addInvoiceItem = () => {
        setNewInvoice({
            ...newInvoice,
            items: [...newInvoice.items, { description: '', quantity: 1, amount: 0 }]
        });
    };

    const removeInvoiceItem = (index) => {
        const newItems = newInvoice.items.filter((_, i) => i !== index);
        setNewInvoice({ ...newInvoice, items: newItems });
    };

    const updateInvoiceItem = (index, field, value) => {
        const newItems = [...newInvoice.items];
        newItems[index][field] = field === 'quantity' || field === 'amount' ? parseFloat(value) || 0 : value;
        setNewInvoice({ ...newInvoice, items: newItems });
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'paid': { color: 'bg-green-100 text-green-800', icon: '✓' },
            'pending': { color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
            'partial': { color: 'bg-blue-100 text-blue-800', icon: '💰' },
            'overdue': { color: 'bg-red-100 text-red-800', icon: '⚠️' },
            'cancelled': { color: 'bg-gray-100 text-gray-800', icon: '✗' }
        };

        const config = statusConfig[status] || statusConfig.pending;
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                {config.icon} {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const getPaymentMethodBadge = (method) => {
        const methodConfig = {
            'cash': { color: 'bg-green-100 text-green-800', text: 'Cash' },
            'credit_card': { color: 'bg-blue-100 text-blue-800', text: 'Credit Card' },
            'debit_card': { color: 'bg-purple-100 text-purple-800', text: 'Debit Card' },
            'insurance': { color: 'bg-indigo-100 text-indigo-800', text: 'Insurance' },
            'online': { color: 'bg-teal-100 text-teal-800', text: 'Online' },
            'cheque': { color: 'bg-yellow-100 text-yellow-800', text: 'Cheque' }
        };

        const config = methodConfig[method] || methodConfig.cash;
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                {config.text}
            </span>
        );
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const calculateInvoiceTotal = () => {
        return newInvoice.items.reduce((sum, item) => sum + (item.amount * item.quantity), 0);
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Billing & Invoices</h1>
                    <p className="text-gray-600">Manage patient billing and payments</p>
                </div>
                <button
                    onClick={() => setShowNewInvoiceModal(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <FaPlus className="mr-2" />
                    Create Invoice
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <FaMoneyBillWave className="text-2xl text-blue-500 mr-3" />
                        <div>
                            <p className="text-sm text-gray-500">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.totalAmount, 0))}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <FaClock className="text-2xl text-yellow-500 mr-3" />
                        <div>
                            <p className="text-sm text-gray-500">Pending</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {invoices.filter(i => i.status === 'pending').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <FaExclamationTriangle className="text-2xl text-red-500 mr-3" />
                        <div>
                            <p className="text-sm text-gray-500">Overdue</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {invoices.filter(i => i.status === 'overdue').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <FaCheckCircle className="text-2xl text-green-500 mr-3" />
                        <div>
                            <p className="text-sm text-gray-500">Paid</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {invoices.filter(i => i.status === 'paid').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by patient or invoice ID..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && loadBilling()}
                                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <div className="flex flex-wrap gap-2">
                            {['all', 'pending', 'paid', 'partial', 'overdue', 'cancelled'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-3 py-1 rounded-lg text-sm ${statusFilter === status ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Actions</label>
                        <button
                            onClick={loadBilling}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            {/* Invoices Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : invoices.length === 0 ? (
                    <div className="text-center py-12">
                        <FaMoneyBillWave className="mx-auto text-gray-400 text-4xl mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
                        <p className="text-gray-500">Create your first invoice to get started</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Invoice
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
                                        Payment Method
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
                                {invoices.map((invoice) => (
                                    <tr key={invoice.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">{invoice.invoiceId}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{invoice.patientName}</div>
                                            <div className="text-xs text-gray-500">ID: {invoice.patientId}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {invoice.date}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {formatCurrency(invoice.totalAmount)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getPaymentMethodBadge(invoice.paymentMethod)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(invoice.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedInvoice(invoice);
                                                        setShowViewModal(true);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-900 px-2 py-1 bg-blue-50 rounded"
                                                    title="View Details"
                                                >
                                                    <FaEye />
                                                </button>

                                                <button
                                                    onClick={() => window.print()}
                                                    className="text-gray-600 hover:text-gray-900 px-2 py-1 bg-gray-50 rounded"
                                                    title="Print"
                                                >
                                                    <FaPrint />
                                                </button>

                                                {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedInvoice(invoice);
                                                            setPaymentData({
                                                                amount: invoice.totalAmount,
                                                                paymentMethod: invoice.paymentMethod || 'cash',
                                                                transactionId: '',
                                                                notes: ''
                                                            });
                                                            setShowPaymentModal(true);
                                                        }}
                                                        className="text-green-600 hover:text-green-900 px-2 py-1 bg-green-50 rounded"
                                                        title="Receive Payment"
                                                    >
                                                        <FaMoneyBillWave />
                                                    </button>
                                                )}

                                                {invoice.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleUpdateInvoiceStatus(invoice.id, 'cancelled')}
                                                        className="text-red-600 hover:text-red-900 px-2 py-1 bg-red-50 rounded text-xs"
                                                        title="Cancel Invoice"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* New Invoice Modal */}
            {showNewInvoiceModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Create New Invoice</h3>
                                <button
                                    onClick={() => setShowNewInvoiceModal(false)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Patient Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Select Patient *
                                    </label>
                                    <select
                                        value={newInvoice.patientId}
                                        onChange={(e) => setNewInvoice({ ...newInvoice, patientId: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Select a patient...</option>
                                        {patients.map(patient => (
                                            <option key={patient.id} value={patient.id}>
                                                {patient.firstName} {patient.lastName} - {patient.patientId}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Invoice Items */}
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-medium text-gray-900">Invoice Items</h4>
                                        <button
                                            onClick={addInvoiceItem}
                                            className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                                        >
                                            <FaPlus className="mr-1" /> Add Item
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {newInvoice.items.map((item, index) => (
                                            <div key={index} className="grid grid-cols-12 gap-2 items-center p-4 bg-gray-50 rounded-lg">
                                                <div className="col-span-6">
                                                    <input
                                                        type="text"
                                                        placeholder="Item description"
                                                        value={item.description}
                                                        onChange={(e) => updateInvoiceItem(index, 'description', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>

                                                <div className="col-span-2">
                                                    <input
                                                        type="number"
                                                        placeholder="Qty"
                                                        value={item.quantity}
                                                        onChange={(e) => updateInvoiceItem(index, 'quantity', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        min="1"
                                                    />
                                                </div>

                                                <div className="col-span-3">
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            placeholder="0.00"
                                                            value={item.amount}
                                                            onChange={(e) => updateInvoiceItem(index, 'amount', e.target.value)}
                                                            className="pl-8 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-span-1">
                                                    {newInvoice.items.length > 1 && (
                                                        <button
                                                            onClick={() => removeInvoiceItem(index)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-gray-900">Total Amount:</span>
                                        <span className="text-xl font-bold text-blue-700">
                                            {formatCurrency(calculateInvoiceTotal())}
                                        </span>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Payment Method
                                    </label>
                                    <select
                                        value={newInvoice.paymentMethod}
                                        onChange={(e) => setNewInvoice({ ...newInvoice, paymentMethod: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select payment method</option>
                                        <option value="cash">Cash</option>
                                        <option value="credit_card">Credit Card</option>
                                        <option value="debit_card">Debit Card</option>
                                        <option value="insurance">Insurance</option>
                                        <option value="online">Online Payment</option>
                                        <option value="cheque">Cheque</option>
                                    </select>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                    <textarea
                                        value={newInvoice.notes}
                                        onChange={(e) => setNewInvoice({ ...newInvoice, notes: e.target.value })}
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Any additional notes or instructions..."
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setShowNewInvoiceModal(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateInvoice}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Create Invoice
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* View Invoice Modal */}
            {showViewModal && selectedInvoice && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Invoice #{selectedInvoice.invoiceId}</h3>
                                    <p className="text-gray-600">Patient: {selectedInvoice.patientName}</p>
                                </div>
                                <button
                                    onClick={() => setShowViewModal(false)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Invoice Header */}
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-blue-800 mb-2">Hospital Information</h4>
                                    <p className="text-gray-700">General Hospital</p>
                                    <p className="text-sm text-gray-600">123 Medical Street, City</p>
                                    <p className="text-sm text-gray-600">Phone: (555) 123-4567</p>
                                </div>

                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-green-800 mb-2">Invoice Details</h4>
                                    <div className="space-y-1">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Date:</span>
                                            <span className="font-medium">{selectedInvoice.date}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Status:</span>
                                            <span>{getStatusBadge(selectedInvoice.status)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Payment Method:</span>
                                            <span>{getPaymentMethodBadge(selectedInvoice.paymentMethod)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Items Table */}
                            <div className="mb-6">
                                <h4 className="font-medium text-gray-900 mb-4">Items</h4>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Description
                                                </th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Amount
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {selectedInvoice.items.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="px-4 py-2 text-sm text-gray-900">
                                                        {item.description}
                                                    </td>
                                                    <td className="px-4 py-2 text-sm text-gray-900">
                                                        {formatCurrency(item.amount)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-gray-50">
                                            <tr>
                                                <td className="px-4 py-2 text-sm font-medium text-gray-900">
                                                    Total Amount
                                                </td>
                                                <td className="px-4 py-2 text-sm font-bold text-gray-900">
                                                    {formatCurrency(selectedInvoice.totalAmount)}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => window.print()}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
                                >
                                    <FaPrint className="mr-2" />
                                    Print Invoice
                                </button>

                                <button
                                    onClick={() => setShowViewModal(false)}
                                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && selectedInvoice && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Receive Payment</h3>
                                <button
                                    onClick={() => setShowPaymentModal(false)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-700">Invoice Total:</span>
                                        <span className="text-lg font-bold text-blue-700">
                                            {formatCurrency(selectedInvoice.totalAmount)}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Amount Received *
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={paymentData.amount}
                                            onChange={(e) => setPaymentData({ ...paymentData, amount: parseFloat(e.target.value) || 0 })}
                                            className="pl-8 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Payment Method *
                                    </label>
                                    <select
                                        value={paymentData.paymentMethod}
                                        onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="cash">Cash</option>
                                        <option value="credit_card">Credit Card</option>
                                        <option value="debit_card">Debit Card</option>
                                        <option value="online">Online Payment</option>
                                        <option value="cheque">Cheque</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Transaction ID (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={paymentData.transactionId}
                                        onChange={(e) => setPaymentData({ ...paymentData, transactionId: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter transaction ID..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Notes
                                    </label>
                                    <textarea
                                        value={paymentData.notes}
                                        onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                                        rows="2"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Any payment notes..."
                                    />
                                </div>

                                {paymentData.amount < selectedInvoice.totalAmount && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                                        <div className="flex items-center">
                                            <FaExclamationTriangle className="text-yellow-500 mr-2" />
                                            <div>
                                                <p className="text-sm font-medium text-yellow-800">Partial Payment</p>
                                                <p className="text-xs text-yellow-700">
                                                    Remaining balance: {formatCurrency(selectedInvoice.totalAmount - paymentData.amount)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setShowPaymentModal(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleProcessPayment}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    Process Payment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Billing;