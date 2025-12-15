// src/pages/patient/Billing.js
import React, { useState } from 'react';
import { CreditCard, FileText, Download, Clock, CheckCircle, AlertTriangle, Search, Filter } from 'lucide-react';

const Billing = () => {
    const [activeTab, setActiveTab] = useState('pending');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    const invoices = {
        pending: [
            {
                id: 1,
                invoiceId: 'INV-001234',
                date: '2024-01-15',
                amount: 250.00,
                dueDate: '2024-01-30',
                status: 'pending',
                items: [
                    { description: 'Consultation Fee', amount: 150.00 },
                    { description: 'Lab Tests', amount: 100.00 }
                ]
            },
            {
                id: 2,
                invoiceId: 'INV-001235',
                date: '2024-01-10',
                amount: 180.00,
                dueDate: '2024-01-25',
                status: 'overdue',
                items: [
                    { description: 'Medication', amount: 180.00 }
                ]
            }
        ],
        paid: [
            {
                id: 3,
                invoiceId: 'INV-001233',
                date: '2023-12-20',
                amount: 320.00,
                paidDate: '2023-12-22',
                status: 'paid',
                items: [
                    { description: 'X-Ray', amount: 200.00 },
                    { description: 'Consultation', amount: 120.00 }
                ]
            }
        ]
    };

    const handlePayNow = (invoice) => {
        setSelectedInvoice(invoice);
        setShowPaymentModal(true);
    };

    const handlePaymentSubmit = () => {
        // Process payment
        setShowPaymentModal(false);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Billing & Payments</h1>
                    <p className="text-gray-600">View invoices and manage payments</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card">
                    <div className="flex items-center">
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <CreditCard className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-lg text-gray-500">Total Balance</p>
                            <p className="text-2xl font-bold">$430.00</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center">
                        <div className="bg-green-100 p-3 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-lg text-gray-500">Paid This Month</p>
                            <p className="text-2xl font-bold">$320.00</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center">
                        <div className="bg-yellow-100 p-3 rounded-lg">
                            <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-lg text-gray-500">Pending</p>
                            <p className="text-2xl font-bold">$250.00</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center">
                        <div className="bg-red-100 p-3 rounded-lg">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-lg text-gray-500">Overdue</p>
                            <p className="text-2xl font-bold">$180.00</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {['pending', 'paid', 'all'].map((tab) => (
                        <button
                            key={tab}
                            className={`py-2 px-1 border-b-2 font-medium text-lg ${activeTab === tab
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                                {invoices[tab]?.length || 3}
                            </span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search invoices..."
                        className="input-field pl-10"
                    />
                </div>
                <div className="flex gap-2">
                    <select className="input-field">
                        <option>Date Range</option>
                        <option>Last 30 days</option>
                        <option>Last 3 months</option>
                        <option>This year</option>
                    </select>
                    <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </button>
                </div>
            </div>

            {/* Invoices List */}
            <div className="space-y-4">
                {invoices[activeTab]?.map((invoice) => (
                    <div key={invoice.id} className="card hover:shadow-lg transition-shadow">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-start">
                                    <div className="bg-blue-100 p-3 rounded-lg">
                                        <FileText className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <div className="flex items-center flex-wrap gap-2">
                                            <h3 className="font-bold text-lg">Invoice #{invoice.invoiceId}</h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                                                invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {invoice.status.toUpperCase()}
                                            </span>
                                        </div>

                                        <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <p className="text-lg text-gray-500">Date</p>
                                                <p className="font-medium">{invoice.date}</p>
                                            </div>
                                            <div>
                                                <p className="text-lg text-gray-500">Amount</p>
                                                <p className="font-bold text-lg">${invoice.amount.toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <p className="text-lg text-gray-500">Due Date</p>
                                                <p className="font-medium">{invoice.dueDate}</p>
                                            </div>
                                            <div>
                                                <p className="text-lg text-gray-500">Items</p>
                                                <p className="font-medium">{invoice.items.length} items</p>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <p className="text-lg text-gray-500 mb-1">Items:</p>
                                            <div className="space-y-1">
                                                {invoice.items.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between text-lg">
                                                        <span>{item.description}</span>
                                                        <span>${item.amount.toFixed(2)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 md:mt-0 flex flex-col space-y-2">
                                {invoice.status !== 'paid' && (
                                    <button
                                        onClick={() => handlePayNow(invoice)}
                                        className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        <CreditCard className="w-4 h-4 mr-2" />
                                        Pay Now
                                    </button>
                                )}
                                <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                </button>
                                <button className="flex items-center justify-center px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50">
                                    <FileText className="w-4 h-4 mr-2" />
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Payment History */}
            <div className="card">
                <h2 className="text-xl font-bold mb-6">Payment History</h2>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Invoice</th>
                                <th>Amount</th>
                                <th>Method</th>
                                <th>Status</th>
                                <th>Receipt</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            <tr>
                                <td>2024-01-22</td>
                                <td className="font-medium">INV-001233</td>
                                <td>$320.00</td>
                                <td>Credit Card</td>
                                <td>
                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                        Completed
                                    </span>
                                </td>
                                <td>
                                    <button className="text-blue-600 hover:text-blue-700 text-lg">
                                        Download
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>2023-12-15</td>
                                <td className="font-medium">INV-001232</td>
                                <td>$150.00</td>
                                <td>Insurance</td>
                                <td>
                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                        Completed
                                    </span>
                                </td>
                                <td>
                                    <button className="text-blue-600 hover:text-blue-700 text-lg">
                                        Download
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">Make Payment</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-gray-600">Invoice: {selectedInvoice?.invoiceId}</p>
                                <p className="text-2xl font-bold mt-1">${selectedInvoice?.amount.toFixed(2)}</p>
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Payment Method
                                </label>
                                <select className="input-field">
                                    <option>Credit Card</option>
                                    <option>Debit Card</option>
                                    <option>Bank Transfer</option>
                                    <option>PayPal</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Card Number
                                </label>
                                <input type="text" className="input-field" placeholder="1234 5678 9012 3456" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-2">
                                        Expiry Date
                                    </label>
                                    <input type="text" className="input-field" placeholder="MM/YY" />
                                </div>
                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-2">
                                        CVV
                                    </label>
                                    <input type="text" className="input-field" placeholder="123" />
                                </div>
                            </div>

                            <div className="flex space-x-2 pt-4">
                                <button
                                    onClick={() => setShowPaymentModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handlePaymentSubmit}
                                    className="flex-1 btn-primary"
                                >
                                    Pay ${selectedInvoice?.amount.toFixed(2)}
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