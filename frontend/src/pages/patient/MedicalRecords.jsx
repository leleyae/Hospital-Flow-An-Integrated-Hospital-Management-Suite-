// src/pages/patient/MedicalRecords.js
import React, { useState } from 'react';
import { FileText, Download, Eye, Calendar, Filter, Search } from 'lucide-react';

const MedicalRecords = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');

    const medicalRecords = [
        {
            id: 1,
            title: 'Annual Physical Exam',
            date: '2024-01-10',
            doctor: 'Dr. Sarah Johnson',
            category: 'examination',
            fileSize: '2.4 MB',
            type: 'PDF'
        },
        {
            id: 2,
            title: 'Blood Test Results',
            date: '2024-01-08',
            doctor: 'Lab Corp',
            category: 'lab',
            fileSize: '1.8 MB',
            type: 'PDF'
        },
        {
            id: 3,
            title: 'X-Ray Report - Chest',
            date: '2023-12-15',
            doctor: 'Dr. Michael Chen',
            category: 'imaging',
            fileSize: '4.2 MB',
            type: 'DICOM'
        },
        {
            id: 4,
            title: 'Prescription History',
            date: '2023-12-01',
            doctor: 'Dr. Emily Wilson',
            category: 'prescription',
            fileSize: '0.8 MB',
            type: 'PDF'
        }
    ];

    const categories = [
        { id: 'all', label: 'All Records', count: medicalRecords.length },
        { id: 'examination', label: 'Examinations', count: 1 },
        { id: 'lab', label: 'Lab Results', count: 1 },
        { id: 'imaging', label: 'Imaging', count: 1 },
        { id: 'prescription', label: 'Prescriptions', count: 1 }
    ];

    const filteredRecords = selectedCategory === 'all'
        ? medicalRecords
        : medicalRecords.filter(record => record.category === selectedCategory);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Medical Records</h1>
                <p className="text-gray-600">Access and manage your medical history</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600">Total Records</p>
                    <p className="text-2xl font-bold">12</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600">This Year</p>
                    <p className="text-2xl font-bold">4</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-600">Lab Results</p>
                    <p className="text-2xl font-bold">8</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-yellow-600">Imaging</p>
                    <p className="text-2xl font-bold">3</p>
                </div>
            </div>

            {/* Categories */}
            <div className="flex space-x-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`px-4 py-2 rounded-lg whitespace-nowrap ${selectedCategory === category.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {category.label}
                        <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                            {category.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search medical records..."
                        className="input-field pl-10"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Calendar className="w-4 h-4 mr-2" />
                        Date Range
                    </button>
                    <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </button>
                </div>
            </div>

            {/* Records List */}
            <div className="space-y-4">
                {filteredRecords.map((record) => (
                    <div key={record.id} className="card hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="bg-blue-100 p-3 rounded-lg">
                                    <FileText className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="font-bold">{record.title}</h3>
                                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                        <span className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            {record.date}
                                        </span>
                                        <span>{record.doctor}</span>
                                        <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                                            {record.type}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                    <Eye className="w-5 h-5 text-gray-600" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                    <Download className="w-5 h-5 text-gray-600" />
                                </button>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                    Share
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>File size: {record.fileSize}</span>
                                <span>Category: {record.category}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Export Section */}
            <div className="card bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                        <h3 className="font-bold text-lg">Export All Records</h3>
                        <p className="text-gray-600 mt-1">Download your complete medical history in one file</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex space-x-2">
                        <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
                            Export as PDF
                        </button>
                        <button className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50">
                            Export as CSV
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MedicalRecords;