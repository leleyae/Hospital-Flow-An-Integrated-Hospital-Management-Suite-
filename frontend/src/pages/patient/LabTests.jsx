// src/pages/patient/LabTests.js
import React, { useState } from 'react';
import { Beaker, Calendar, Download, Eye, AlertTriangle, CheckCircle, Clock, Search, Filter } from 'lucide-react';

const LabTests = () => {
    const [activeTab, setActiveTab] = useState('pending');
    const [selectedTest, setSelectedTest] = useState(null);

    const labTests = {
        pending: [
            {
                id: 1,
                testId: 'LAB-001234',
                testName: 'Complete Blood Count',
                date: '2024-01-15',
                status: 'pending',
                priority: 'routine',
                instructions: 'Fasting required for 8 hours',
                location: 'Main Lab, Room 101'
            },
            {
                id: 2,
                testId: 'LAB-001235',
                testName: 'Lipid Profile',
                date: '2024-01-16',
                status: 'scheduled',
                priority: 'routine',
                instructions: 'Fasting required for 12 hours',
                location: 'Main Lab, Room 101'
            }
        ],
        completed: [
            {
                id: 3,
                testId: 'LAB-001233',
                testName: 'Blood Glucose',
                date: '2024-01-10',
                completedDate: '2024-01-12',
                status: 'completed',
                results: '95 mg/dL (Normal)',
                doctor: 'Dr. Sarah Johnson',
                notes: 'Within normal range'
            },
            {
                id: 4,
                testId: 'LAB-001232',
                testName: 'Urinalysis',
                date: '2024-01-05',
                completedDate: '2024-01-06',
                status: 'completed',
                results: 'Normal',
                doctor: 'Dr. Michael Chen',
                notes: 'No abnormalities detected'
            }
        ]
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'scheduled': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'urgent': return 'bg-red-100 text-red-800';
            case 'routine': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Lab Tests & Results</h1>
                    <p className="text-gray-600">View and manage your laboratory tests</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card">
                    <div className="flex items-center">
                        <div className="bg-yellow-100 p-3 rounded-lg">
                            <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
<<<<<<< HEAD
                            <p className="text-lg text-gray-500">Pending Tests</p>
=======
                            <p className="text-sm text-gray-500">Pending Tests</p>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                            <p className="text-2xl font-bold">2</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center">
                        <div className="bg-green-100 p-3 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
<<<<<<< HEAD
                            <p className="text-lg text-gray-500">Completed</p>
=======
                            <p className="text-sm text-gray-500">Completed</p>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                            <p className="text-2xl font-bold">8</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center">
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <Beaker className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
<<<<<<< HEAD
                            <p className="text-lg text-gray-500">This Month</p>
=======
                            <p className="text-sm text-gray-500">This Month</p>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                            <p className="text-2xl font-bold">3</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center">
                        <div className="bg-red-100 p-3 rounded-lg">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="ml-4">
<<<<<<< HEAD
                            <p className="text-lg text-gray-500">Abnormal Results</p>
=======
                            <p className="text-sm text-gray-500">Abnormal Results</p>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                            <p className="text-2xl font-bold">1</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {['pending', 'completed', 'all'].map((tab) => (
                        <button
                            key={tab}
<<<<<<< HEAD
                            className={`py-2 px-1 border-b-2 font-medium text-lg ${activeTab === tab
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
=======
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                }`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                                {labTests[tab]?.length || 4}
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
                        placeholder="Search tests..."
                        className="input-field pl-10"
                    />
                </div>
                <div className="flex gap-2">
                    <select className="input-field">
                        <option>All Types</option>
                        <option>Blood Tests</option>
                        <option>Urine Tests</option>
                        <option>Imaging</option>
                    </select>
                    <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </button>
                </div>
            </div>

            {/* Tests List */}
            <div className="space-y-4">
                {labTests[activeTab]?.map((test) => (
                    <div key={test.id} className="card hover:shadow-lg transition-shadow">
                        <div className="flex flex-col md:flex-row md:items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-start">
                                    <div className="bg-blue-100 p-3 rounded-lg">
                                        <Beaker className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <div className="flex items-center flex-wrap gap-2">
                                            <h3 className="font-bold text-lg">{test.testName}</h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                                                {test.status.toUpperCase()}
                                            </span>
                                            {test.priority && (
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(test.priority)}`}>
                                                    {test.priority.toUpperCase()}
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
<<<<<<< HEAD
                                                <p className="text-lg text-gray-500">Test ID</p>
                                                <p className="font-medium">{test.testId}</p>
                                            </div>
                                            <div>
                                                <p className="text-lg text-gray-500">Date</p>
=======
                                                <p className="text-sm text-gray-500">Test ID</p>
                                                <p className="font-medium">{test.testId}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Date</p>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                <div className="flex items-center">
                                                    <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                                                    <span>{test.date}</span>
                                                </div>
                                            </div>
                                            {test.completedDate && (
                                                <div>
<<<<<<< HEAD
                                                    <p className="text-lg text-gray-500">Completed</p>
=======
                                                    <p className="text-sm text-gray-500">Completed</p>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                    <p>{test.completedDate}</p>
                                                </div>
                                            )}
                                            {test.doctor && (
                                                <div>
<<<<<<< HEAD
                                                    <p className="text-lg text-gray-500">Doctor</p>
=======
                                                    <p className="text-sm text-gray-500">Doctor</p>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                    <p>{test.doctor}</p>
                                                </div>
                                            )}
                                        </div>

                                        {test.instructions && (
                                            <div className="mt-4">
<<<<<<< HEAD
                                                <p className="text-lg text-gray-500">Instructions</p>
                                                <p className="text-gray-700">{test.instructions}</p>
                                                {test.location && (
                                                    <p className="text-lg text-gray-600 mt-1">
=======
                                                <p className="text-sm text-gray-500">Instructions</p>
                                                <p className="text-gray-700">{test.instructions}</p>
                                                {test.location && (
                                                    <p className="text-sm text-gray-600 mt-1">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                        <span className="font-medium">Location:</span> {test.location}
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {test.results && (
                                            <div className="mt-4">
<<<<<<< HEAD
                                                <p className="text-lg text-gray-500">Results</p>
                                                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                                    <p className="font-medium text-green-800">{test.results}</p>
                                                    {test.notes && (
                                                        <p className="text-lg text-green-700 mt-1">{test.notes}</p>
=======
                                                <p className="text-sm text-gray-500">Results</p>
                                                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                                    <p className="font-medium text-green-800">{test.results}</p>
                                                    {test.notes && (
                                                        <p className="text-sm text-green-700 mt-1">{test.notes}</p>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 md:mt-0 flex flex-col space-y-2">
                                {test.status === 'completed' && (
                                    <>
                                        <button className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                            <Eye className="w-4 h-4 mr-2" />
                                            View Full Report
                                        </button>
                                        <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                            <Download className="w-4 h-4 mr-2" />
                                            Download PDF
                                        </button>
                                    </>
                                )}
                                {test.status === 'scheduled' && (
                                    <button className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                        View Appointment
                                    </button>
                                )}
                                {test.status === 'pending' && (
                                    <button className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                                        Schedule Test
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Test History */}
            <div className="card">
                <h2 className="text-xl font-bold mb-6">Test History Trends</h2>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between mb-1">
<<<<<<< HEAD
                            <span className="text-lg font-medium">Blood Glucose (mg/dL)</span>
                            <span className="text-lg text-gray-500">Last 6 months</span>
=======
                            <span className="text-sm font-medium">Blood Glucose (mg/dL)</span>
                            <span className="text-sm text-gray-500">Last 6 months</span>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>
<<<<<<< HEAD
                        <div className="flex justify-between text-lg text-gray-600 mt-1">
=======
                        <div className="flex justify-between text-sm text-gray-600 mt-1">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                            <span>Jan: 95</span>
                            <span>Feb: 98</span>
                            <span>Mar: 92</span>
                            <span>Apr: 97</span>
                            <span>May: 95</span>
                            <span>Jun: 96</span>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between mb-1">
<<<<<<< HEAD
                            <span className="text-lg font-medium">Cholesterol (mg/dL)</span>
                            <span className="text-lg text-gray-500">Last 6 months</span>
=======
                            <span className="text-sm font-medium">Cholesterol (mg/dL)</span>
                            <span className="text-sm text-gray-500">Last 6 months</span>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                        </div>
<<<<<<< HEAD
                        <div className="flex justify-between text-lg text-gray-600 mt-1">
=======
                        <div className="flex justify-between text-sm text-gray-600 mt-1">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                            <span>Jan: 180</span>
                            <span>Feb: 175</span>
                            <span>Mar: 182</span>
                            <span>Apr: 178</span>
                            <span>May: 175</span>
                            <span>Jun: 170</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LabTests;