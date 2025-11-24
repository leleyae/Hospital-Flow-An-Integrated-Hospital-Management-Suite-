// src/pages/nurse/Triage.js
import React, { useState } from 'react';
import { AlertTriangle, Clock, User, Activity, Thermometer, Droplets, Heart } from 'lucide-react';

const Triage = () => {
    const [activeFilter, setActiveFilter] = useState('all');

    const triagePatients = [
        {
            id: 1,
            name: 'John Smith',
            age: 45,
            arrivalTime: '09:15 AM',
            vitalSigns: {
                bp: '140/90',
                hr: 88,
                temp: 37.2,
                spo2: 98
            },
            chiefComplaint: 'Chest pain',
            painLevel: 7,
            triageTag: 'RED',
            waitingTime: '15 min'
        },
        {
            id: 2,
            name: 'Emma Wilson',
            age: 32,
            arrivalTime: '09:30 AM',
            vitalSigns: {
                bp: '120/80',
                hr: 72,
                temp: 38.5,
                spo2: 96
            },
            chiefComplaint: 'Fever & cough',
            painLevel: 4,
            triageTag: 'YELLOW',
            waitingTime: '30 min'
        },
        {
            id: 3,
            name: 'Robert Chen',
            age: 58,
            arrivalTime: '09:45 AM',
            vitalSigns: {
                bp: '160/100',
                hr: 95,
                temp: 36.8,
                spo2: 94
            },
            chiefComplaint: 'Shortness of breath',
            painLevel: 8,
            triageTag: 'RED',
            waitingTime: '10 min'
        }
    ];

    const getTagColor = (tag) => {
        switch (tag) {
            case 'RED': return 'bg-red-100 text-red-800 border-red-200';
            case 'YELLOW': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'GREEN': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Emergency Triage</h1>
                        <p className="text-red-100 mt-1">Real-time patient monitoring and prioritization</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <p className="text-red-100">Waiting patients</p>
                            <p className="font-bold text-2xl">12</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <div className="bg-red-100 p-2 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-600">Critical (RED)</p>
                            <p className="text-2xl font-bold">3</p>
                        </div>
                    </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <div className="bg-yellow-100 p-2 rounded-lg">
                            <Clock className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-600">Urgent (YELLOW)</p>
                            <p className="text-2xl font-bold">5</p>
                        </div>
                    </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <div className="bg-green-100 p-2 rounded-lg">
                            <User className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-green-600">Non-urgent (GREEN)</p>
                            <p className="text-2xl font-bold">4</p>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <Activity className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-blue-600">Avg Wait Time</p>
                            <p className="text-2xl font-bold">22 min</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex space-x-2 overflow-x-auto pb-2">
                {['all', 'RED', 'YELLOW', 'GREEN', 'waiting', 'in-progress'].map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeFilter === filter
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {filter === 'all' ? 'All Patients' : filter}
                    </button>
                ))}
            </div>

            {/* Triage List */}
            <div className="space-y-4">
                {triagePatients.map((patient) => (
                    <div key={patient.id} className="card hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start">
                                <div className={`p-3 rounded-lg border ${getTagColor(patient.triageTag)}`}>
                                    <AlertTriangle className="w-6 h-6" />
                                </div>
                                <div className="ml-4">
                                    <div className="flex items-center space-x-4">
                                        <h3 className="font-bold text-lg">{patient.name}</h3>
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getTagColor(patient.triageTag)}`}>
                                            {patient.triageTag}
                                        </span>
                                        <span className="text-sm text-gray-500">Age: {patient.age}</span>
                                    </div>

                                    <p className="text-gray-700 mt-2">
                                        <span className="font-medium">Chief Complaint:</span> {patient.chiefComplaint}
                                    </p>

                                    <div className="flex items-center space-x-6 mt-3">
                                        <div className="flex items-center">
                                            <Heart className="w-4 h-4 text-red-500 mr-2" />
                                            <span className="text-sm">BP: {patient.vitalSigns.bp}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Activity className="w-4 h-4 text-blue-500 mr-2" />
                                            <span className="text-sm">HR: {patient.vitalSigns.hr} bpm</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Thermometer className="w-4 h-4 text-orange-500 mr-2" />
                                            <span className="text-sm">Temp: {patient.vitalSigns.temp}°C</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Droplets className="w-4 h-4 text-cyan-500 mr-2" />
                                            <span className="text-sm">SpO₂: {patient.vitalSigns.spo2}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="mb-4">
                                    <p className="text-sm text-gray-500">Arrival</p>
                                    <p className="font-medium">{patient.arrivalTime}</p>
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                        Assess Patient
                                    </button>
                                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                        Update Status
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-6">
                                    <div>
                                        <p className="text-sm text-gray-500">Pain Level</p>
                                        <div className="flex items-center">
                                            {[...Array(10)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`w-6 h-6 mx-0.5 rounded ${i < patient.painLevel
                                                        ? patient.painLevel > 7
                                                            ? 'bg-red-500'
                                                            : patient.painLevel > 4
                                                                ? 'bg-yellow-500'
                                                                : 'bg-green-500'
                                                        : 'bg-gray-200'
                                                        }`}
                                                />
                                            ))}
                                            <span className="ml-2 font-medium">{patient.painLevel}/10</span>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">Waiting Time</p>
                                        <p className="font-medium">{patient.waitingTime}</p>
                                    </div>
                                </div>

                                <div className="flex space-x-2">
                                    <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                                        Assign to Doctor
                                    </button>
                                    <button className="px-3 py-1.5 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
                                        Critical Alert
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Triage Form */}
            <div className="card bg-gray-50">
                <h2 className="text-xl font-bold mb-4">Quick Triage Assessment</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Patient Name
                        </label>
                        <input type="text" className="input-field" placeholder="Enter patient name" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Chief Complaint
                        </label>
                        <input type="text" className="input-field" placeholder="Enter chief complaint" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Vital Signs
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <input type="text" className="input-field" placeholder="BP" />
                            <input type="text" className="input-field" placeholder="HR" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Triage Tag
                        </label>
                        <select className="input-field">
                            <option value="">Select priority</option>
                            <option value="RED">RED - Immediate</option>
                            <option value="YELLOW">YELLOW - Urgent</option>
                            <option value="GREEN">GREEN - Non-urgent</option>
                        </select>
                    </div>
                </div>
                <div className="mt-4">
                    <button className="btn-primary">Add to Triage Queue</button>
                </div>
            </div>
        </div>
    );
};

export default Triage;