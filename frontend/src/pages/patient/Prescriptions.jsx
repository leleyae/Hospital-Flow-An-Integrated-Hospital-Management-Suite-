// src/pages/patient/Prescriptions.js
import React, { useState } from 'react';
import { Pill, Calendar, User, Clock, FileText, Download, RefreshCw, Search, Filter } from 'lucide-react';

const Prescriptions = () => {
    const [activeTab, setActiveTab] = useState('active');
    const [searchQuery, setSearchQuery] = useState('');

    const prescriptions = {
        active: [
            {
                id: 1,
                medication: 'Amoxicillin 500mg',
                doctor: 'Dr. Sarah Johnson',
                date: '2024-01-10',
                status: 'active',
                refills: 2,
                instructions: 'Take one tablet every 8 hours with food',
                dosage: '500mg',
                frequency: 'Every 8 hours',
                duration: '7 days'
            },
            {
                id: 2,
                medication: 'Lisinopril 10mg',
                doctor: 'Dr. Michael Chen',
                date: '2024-01-05',
                status: 'active',
                refills: 1,
                instructions: 'Take once daily in the morning',
                dosage: '10mg',
                frequency: 'Once daily',
                duration: '30 days'
            }
        ],
        completed: [
            {
                id: 3,
                medication: 'Ibuprofen 400mg',
                doctor: 'Dr. Emily Wilson',
                date: '2023-12-20',
                status: 'completed',
                refills: 0,
                instructions: 'Take as needed for pain',
                dosage: '400mg',
                frequency: 'Every 6 hours',
                duration: '10 days'
            }
        ],
        expired: [
            {
                id: 4,
                medication: 'Metformin 850mg',
                doctor: 'Dr. Robert Brown',
                date: '2023-11-15',
                status: 'expired',
                refills: 0,
                instructions: 'Take with meals twice daily',
                dosage: '850mg',
                frequency: 'Twice daily',
                duration: '30 days'
            }
        ]
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'completed': return 'bg-blue-100 text-blue-800';
            case 'expired': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleRefillRequest = (prescriptionId) => {
        // Handle refill request
        console.log('Request refill for:', prescriptionId);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Prescriptions</h1>
                    <p className="text-gray-600">Manage your medications and refills</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card">
                    <div className="flex items-center">
                        <div className="bg-green-100 p-3 rounded-lg">
                            <Pill className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-lg text-gray-500">Active</p>
                            <p className="text-2xl font-bold">2</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center">
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <RefreshCw className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-lg text-gray-500">Refills Available</p>
                            <p className="text-2xl font-bold">3</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center">
                        <div className="bg-yellow-100 p-3 rounded-lg">
                            <Calendar className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-lg text-gray-500">Expiring Soon</p>
                            <p className="text-2xl font-bold">1</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center">
                        <div className="bg-purple-100 p-3 rounded-lg">
                            <FileText className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-lg text-gray-500">Total</p>
                            <p className="text-2xl font-bold">12</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {['active', 'completed', 'expired'].map((tab) => (
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
                                {prescriptions[tab].length}
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
                        placeholder="Search medications..."
                        className="input-field pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <select className="input-field">
                        <option>Sort by</option>
                        <option>Recent First</option>
                        <option>Medication A-Z</option>
                        <option>Expiry Date</option>
                    </select>
                    <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </button>
                </div>
            </div>

            {/* Prescriptions List */}
            <div className="space-y-4">
                {prescriptions[activeTab].map((prescription) => (
                    <div key={prescription.id} className="card hover:shadow-lg transition-shadow">
                        <div className="flex flex-col md:flex-row md:items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-start">
                                    <div className="bg-blue-100 p-3 rounded-lg">
                                        <Pill className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <div className="flex items-center flex-wrap gap-2">
                                            <h3 className="font-bold text-lg">{prescription.medication}</h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(prescription.status)}`}>
                                                {prescription.status.toUpperCase()}
                                            </span>
                                            {prescription.refills > 0 && (
                                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                                    {prescription.refills} refill{prescription.refills !== 1 ? 's' : ''} left
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <p className="text-lg text-gray-500">Prescribed By</p>
                                                <div className="flex items-center">
                                                    <User className="w-4 h-4 text-gray-400 mr-1" />
                                                    <span className="font-medium">{prescription.doctor}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-lg text-gray-500">Date</p>
                                                <div className="flex items-center">
                                                    <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                                                    <span>{prescription.date}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-lg text-gray-500">Dosage</p>
                                                <p className="font-medium">{prescription.dosage}</p>
                                            </div>
                                            <div>
                                                <p className="text-lg text-gray-500">Frequency</p>
                                                <p className="font-medium">{prescription.frequency}</p>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <p className="text-lg text-gray-500">Instructions</p>
                                            <p className="text-gray-700">{prescription.instructions}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 md:mt-0 flex flex-col space-y-2">
                                {prescription.status === 'active' && prescription.refills > 0 && (
                                    <button
                                        onClick={() => handleRefillRequest(prescription.id)}
                                        className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                    >
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Request Refill
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

            {/* Quick Actions */}
            <div className="card bg-blue-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                        <h3 className="font-bold text-lg text-blue-800">Need a New Prescription?</h3>
                        <p className="text-blue-700 mt-1">Schedule an appointment with your doctor to get a new prescription</p>
                    </div>
                    <button className="mt-4 md:mt-0 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                        Book Appointment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Prescriptions;