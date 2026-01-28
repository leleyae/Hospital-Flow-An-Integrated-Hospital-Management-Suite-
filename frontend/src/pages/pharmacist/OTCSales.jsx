import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import {
    MagnifyingGlassIcon,
    PlusIcon,
    TrashIcon,
    ShoppingCartIcon,
    UserIcon,
<<<<<<< HEAD
    CalculatorIcon,
    XMarkIcon
=======
    CalculatorIcon
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
} from '@heroicons/react/24/outline';

const OTCSales = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [cart, setCart] = useState([]);
    const [patientId, setPatientId] = useState('');
    const [patientInfo, setPatientInfo] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [discount, setDiscount] = useState(0);
    const [notes, setNotes] = useState('');
    const [showReceipt, setShowReceipt] = useState(false);
    const [receiptData, setReceiptData] = useState(null);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (searchQuery.length >= 2) {
                searchMedicines();
            }
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    const searchMedicines = async () => {
        try {
            const response = await api.get('/pharmacy/medicines/search', {
                params: { search: searchQuery }
            });
            setSearchResults(response.data.data);
        } catch (error) {
            console.error('Error searching medicines:', error);
        }
    };

    const addToCart = (medicine) => {
        const existingItem = cart.find(item => item.medicineId === medicine.medicineId);

        if (existingItem) {
            setCart(cart.map(item =>
                item.medicineId === medicine.medicineId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, {
                medicineId: medicine.medicineId,
                medicineName: medicine.medicineName,
                genericName: medicine.genericName,
                unitPrice: medicine.unitPrice,
                unit: medicine.unit,
                batchNumber: medicine.batchNumber,
                quantity: 1,
                maxQuantity: medicine.quantity
            }]);
        }
        setSearchQuery('');
        setSearchResults([]);
    };

    const updateQuantity = (medicineId, quantity) => {
        if (quantity < 1) {
            removeFromCart(medicineId);
            return;
        }

        const item = cart.find(item => item.medicineId === medicineId);
        if (item && quantity > item.maxQuantity) {
            alert(`Only ${item.maxQuantity} items available in stock`);
            return;
        }

        setCart(cart.map(item =>
            item.medicineId === medicineId
                ? { ...item, quantity: quantity }
                : item
        ));
    };

    const removeFromCart = (medicineId) => {
        setCart(cart.filter(item => item.medicineId !== medicineId));
    };

    const calculateTotal = () => {
        return cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    };

    const calculateFinalTotal = () => {
        return calculateTotal() - discount;
    };

    const handleCheckout = async () => {
        try {
            const payload = {
                patientId: patientId || null,
                items: cart.map(item => ({
                    medicineId: item.medicineId,
                    quantity: item.quantity
                })),
                paymentMethod,
                discount: parseFloat(discount) || 0,
                notes,
                transactionId: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`
            };

            const response = await api.post('/pharmacy/sales/otc', payload);
            setReceiptData(response.data.data);
            setShowReceipt(true);

            // Clear cart and form
            setCart([]);
            setPatientId('');
            setPatientInfo(null);
            setDiscount(0);
            setNotes('');
        } catch (error) {
            console.error('Error processing sale:', error);
            alert(error.response?.data?.message || 'Error processing sale');
        }
    };

    const printReceipt = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Over-the-Counter Sales</h1>
                    <p className="text-gray-600 mt-2">Sell medicines without prescription</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Search and Add Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Search Box */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Search Medicines</h3>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Search by medicine name, generic name, or manufacturer..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            {/* Search Results */}
                            {searchResults.length > 0 && (
                                <div className="mt-4 border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                                    {searchResults.map((medicine) => {
                                        const inStock = medicine.quantity > 0;
                                        const inCart = cart.find(item => item.medicineId === medicine.medicineId);

                                        return (
                                            <div
                                                key={medicine._id}
                                                className={`p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 ${!inStock ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                                    }`}
                                                onClick={() => inStock && addToCart(medicine)}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">{medicine.medicineName}</h4>
                                                        {medicine.genericName && (
<<<<<<< HEAD
                                                            <p className="text-lg text-gray-600">{medicine.genericName}</p>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-medium text-gray-900">
                                                            ${medicine.unitPrice?.toFixed(2)}
                                                        </p>
                                                        <p className={`text-lg ${inStock ? 'text-green-600' : 'text-red-600'
=======
                                                            <p className="text-sm text-gray-600">{medicine.genericName}</p>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-medium text-gray-900">
                                                            ${medicine.unitPrice?.toFixed(2)}
                                                        </p>
                                                        <p className={`text-xs ${inStock ? 'text-green-600' : 'text-red-600'
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                            }`}>
                                                            {inStock ? `Stock: ${medicine.quantity} ${medicine.unit}` : 'Out of Stock'}
                                                        </p>
                                                        {inCart && (
<<<<<<< HEAD
                                                            <p className="text-lg text-blue-600">In cart: {inCart.quantity}</p>
=======
                                                            <p className="text-xs text-blue-600">In cart: {inCart.quantity}</p>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Shopping Cart */}
                        <div className="bg-white rounded-lg shadow">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">Shopping Cart</h3>
                            </div>
                            <div className="p-6">
                                {cart.length > 0 ? (
                                    <div className="space-y-3">
                                        {cart.map((item) => (
                                            <div key={item.medicineId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900">{item.medicineName}</h4>
                                                    {item.genericName && (
<<<<<<< HEAD
                                                        <p className="text-lg text-gray-600">{item.genericName}</p>
                                                    )}
                                                    <p className="text-lg text-gray-500">Batch: {item.batchNumber}</p>
=======
                                                        <p className="text-sm text-gray-600">{item.genericName}</p>
                                                    )}
                                                    <p className="text-sm text-gray-500">Batch: {item.batchNumber}</p>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => updateQuantity(item.medicineId, item.quantity - 1)}
                                                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.medicineId, item.quantity + 1)}
                                                            disabled={item.quantity >= item.maxQuantity}
                                                            className={`w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg ${item.quantity >= item.maxQuantity ? 'opacity-50 cursor-not-allowed' : ''
                                                                }`}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-medium text-gray-900">
                                                            ${(item.unitPrice * item.quantity).toFixed(2)}
                                                        </p>
<<<<<<< HEAD
                                                        <p className="text-lg text-gray-600">
=======
                                                        <p className="text-sm text-gray-600">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                            ${item.unitPrice?.toFixed(2)} each
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFromCart(item.medicineId)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <ShoppingCartIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                        <p className="text-gray-500">Your cart is empty</p>
<<<<<<< HEAD
                                        <p className="text-lg text-gray-400 mt-1">Search and add medicines to cart</p>
=======
                                        <p className="text-sm text-gray-400 mt-1">Search and add medicines to cart</p>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Checkout */}
                    <div className="space-y-6">
                        {/* Patient Information */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                <UserIcon className="h-5 w-5 inline mr-2" />
                                Patient Information (Optional)
                            </h3>
                            <div className="space-y-3">
                                <div>
<<<<<<< HEAD
                                    <label className="block text-lg font-medium text-gray-700 mb-1">
=======
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                        Patient ID
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        placeholder="Enter patient ID for record keeping"
                                        value={patientId}
                                        onChange={(e) => setPatientId(e.target.value)}
                                    />
                                </div>
                                {patientInfo && (
                                    <div className="bg-blue-50 p-3 rounded-lg">
<<<<<<< HEAD
                                        <p className="text-lg text-blue-800">
=======
                                        <p className="text-sm text-blue-800">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                            Patient: {patientInfo.name}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Payment Information */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                <CalculatorIcon className="h-5 w-5 inline mr-2" />
                                Payment Information
                            </h3>
                            <div className="space-y-3">
                                <div>
<<<<<<< HEAD
                                    <label className="block text-lg font-medium text-gray-700 mb-1">
=======
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                        Payment Method
                                    </label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    >
                                        <option value="cash">Cash</option>
                                        <option value="card">Credit/Debit Card</option>
                                        <option value="mobile">Mobile Payment</option>
                                        <option value="insurance">Insurance</option>
                                    </select>
                                </div>
                                <div>
<<<<<<< HEAD
                                    <label className="block text-lg font-medium text-gray-700 mb-1">
=======
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                        Discount ($)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max={calculateTotal()}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        value={discount}
                                        onChange={(e) => setDiscount(e.target.value)}
                                    />
                                </div>
                                <div>
<<<<<<< HEAD
                                    <label className="block text-lg font-medium text-gray-700 mb-1">
=======
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                        Notes (Optional)
                                    </label>
                                    <textarea
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        rows="2"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Additional notes for this sale..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
                            <div className="space-y-2">
<<<<<<< HEAD
                                <div className="flex justify-between text-lg">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="text-gray-900">${calculateTotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg">
=======
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="text-gray-900">${calculateTotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                    <span className="text-gray-600">Discount</span>
                                    <span className="text-red-600">-${parseFloat(discount).toFixed(2)}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-2 mt-2">
                                    <div className="flex justify-between font-medium text-lg">
                                        <span className="text-gray-900">Total</span>
                                        <span className="text-blue-600">${calculateFinalTotal().toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleCheckout}
                                disabled={cart.length === 0}
                                className={`w-full mt-6 py-3 px-4 rounded-lg font-medium ${cart.length === 0
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                            >
                                <ShoppingCartIcon className="h-5 w-5 inline mr-2" />
                                Process Sale
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Receipt Modal */}
            {showReceipt && receiptData && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900">Sale Receipt</h3>
                            <div className="flex space-x-2">
                                <button
                                    onClick={printReceipt}
<<<<<<< HEAD
                                    className="px-3 py-1 text-lg bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
=======
                                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                >
                                    Print
                                </button>
                                <button
                                    onClick={() => setShowReceipt(false)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6" id="receipt-content">
                            {/* Receipt Header */}
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Pharmacy Receipt</h2>
                                <p className="text-gray-600">Sale ID: {receiptData.saleId}</p>
                                <p className="text-gray-600">
                                    Date: {new Date(receiptData.date).toLocaleString()}
                                </p>
                            </div>

                            {/* Patient Info */}
                            {receiptData.patient && (
                                <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                                    <h4 className="font-medium text-gray-900 mb-2">Patient Information</h4>
<<<<<<< HEAD
                                    <p className="text-lg text-gray-600">
                                        Name: {receiptData.patient.userId.firstName} {receiptData.patient.userId.lastName}
                                    </p>
                                    <p className="text-lg text-gray-600">
=======
                                    <p className="text-sm text-gray-600">
                                        Name: {receiptData.patient.userId.firstName} {receiptData.patient.userId.lastName}
                                    </p>
                                    <p className="text-sm text-gray-600">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                        Patient ID: {receiptData.patient.patientId}
                                    </p>
                                </div>
                            )}

                            {/* Items List */}
                            <div className="mb-6">
                                <h4 className="font-medium text-gray-900 mb-3">Items Purchased</h4>
                                <div className="space-y-2">
                                    {receiptData.items.map((item, index) => (
<<<<<<< HEAD
                                        <div key={index} className="flex justify-between text-lg">
=======
                                        <div key={index} className="flex justify-between text-sm">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                            <div>
                                                <span className="font-medium">{item.medicineName}</span>
                                                <p className="text-gray-600">
                                                    {item.quantity} × ${item.unitPrice.toFixed(2)} {item.unit}
                                                </p>
                                            </div>
                                            <span className="font-medium">
                                                ${item.totalPrice.toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Payment Summary */}
                            <div className="border-t border-gray-200 pt-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span>${receiptData.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Discount</span>
                                        <span className="text-red-600">-${receiptData.discount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2 mt-2">
                                        <span>Total</span>
                                        <span>${receiptData.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Details */}
                            <div className="mt-6 p-3 bg-gray-50 rounded-lg">
<<<<<<< HEAD
                                <p className="text-lg text-gray-600">
                                    Payment Method: {receiptData.paymentMethod.toUpperCase()}
                                </p>
                                {receiptData.transactionId && (
                                    <p className="text-lg text-gray-600">
=======
                                <p className="text-sm text-gray-600">
                                    Payment Method: {receiptData.paymentMethod.toUpperCase()}
                                </p>
                                {receiptData.transactionId && (
                                    <p className="text-sm text-gray-600">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                        Transaction ID: {receiptData.transactionId}
                                    </p>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="text-center mt-8 pt-4 border-t border-gray-200">
<<<<<<< HEAD
                                <p className="text-lg text-gray-500">Thank you for your purchase!</p>
                                <p className="text-lg text-gray-400 mt-2">
=======
                                <p className="text-sm text-gray-500">Thank you for your purchase!</p>
                                <p className="text-xs text-gray-400 mt-2">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                    Please retain this receipt for your records
                                </p>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
                            <button
                                onClick={() => setShowReceipt(false)}
                                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OTCSales;