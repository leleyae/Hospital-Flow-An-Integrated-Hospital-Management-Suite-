// src/pages/doctor/Triage.jsx
import React, { useState } from 'react';
import {
    AlertTriangle,
    User,
    Clock,
    Heart,
    Thermometer,
    Droplets,
    Activity,
    Plus,
    Search,
    Filter,
    ChevronRight,
    CheckCircle,
    XCircle,
    Eye,
    FileText
} from 'lucide-react';

const Triage = () => {
    const [triageCases, setTriageCases] = useState([
        {
            id: 1,
            patientName: 'John Smith',
            patientId: 'PAT00123',
            age: 45,
            gender: 'Male',
            arrivalTime: '10:15 AM',
            priority: 'RED',
            vitalSigns: {
                bloodPressure: '150/95',
                heartRate: 110,
                temperature: 38.5,
                respiratoryRate: 22,
                oxygenSaturation: 92
            },
            chiefComplaint: 'Chest pain radiating to left arm',
            painLevel: 8,
            status: 'waiting'
        },
        {
            id: 2,
            patientName: 'Mary Johnson',
            patientId: 'PAT00456',
            age: 32,
            gender: 'Female',
            arrivalTime: '10:30 AM',
            priority: 'YELLOW',
            vitalSigns: {
                bloodPressure: '130/85',
                heartRate: 90,
                temperature: 37.8,
                respiratoryRate: 18,
                oxygenSaturation: 96
            },
            chiefComplaint: 'Abdominal pain with nausea',
            painLevel: 6,
            status: 'assessing'
        },
        {
            id: 3,
            patientName: 'Robert Chen',
            patientId: 'PAT00789',
            age: 28,
            gender: 'Male',
            arrivalTime: '10:45 AM',
            priority: 'GREEN',
            vitalSigns: {
                bloodPressure: '120/80',
                heartRate: 75,
                temperature: 36.8,
                respiratoryRate: 16,
                oxygenSaturation: 98
            },
            chiefComplaint: 'Ankle sprain from sports injury',
            painLevel: 4,
            status: 'waiting'
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPriority, setSelectedPriority] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');

    const priorities = [
        { id: 'all', label: 'All', color: 'gray' },
        { id: 'RED', label: 'Red - Immediate', color: 'red' },
        { id: 'YELLOW', label: 'Yellow - Urgent', color: 'yellow' },
        { id: 'GREEN', label: 'Green - Delayed', color: 'green' },
    ];

    const statuses = [
        { id: 'all', label: 'All Status' },
        { id: 'waiting', label: 'Waiting' },
        { id: 'assessing', label: 'Assessing' },
        { id: 'admitted', label: 'Admitted' },
        { id: 'discharged', label: 'Discharged' },
    ];

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'RED': return 'bg-red-100 text-red-800 border-red-200';
            case 'YELLOW': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'GREEN': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'waiting': return 'bg-yellow-100 text-yellow-800';
            case 'assessing': return 'bg-blue-100 text-blue-800';
            case 'admitted': return 'bg-purple-100 text-purple-800';
            case 'discharged': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredCases = triageCases.filter(tCase => {
        // Priority filter
        if (selectedPriority !== 'all' && tCase.priority !== selectedPriority) return false;

        // Status filter
        if (selectedStatus !== 'all' && tCase.status !== selectedStatus) return false;

        // Search filter
        if (searchTerm) {
            const patientName = tCase.patientName.toLowerCase();
            const patientId = tCase.patientId.toLowerCase();
            const complaint = tCase.chiefComplaint.toLowerCase();

            return (
                patientName.includes(searchTerm.toLowerCase()) ||
                patientId.includes(searchTerm.toLowerCase()) ||
                complaint.includes(searchTerm.toLowerCase())
            );
        }

        return true;
    });

    const updateCaseStatus = (caseId, newStatus) => {
        setTriageCases(triageCases.map(tCase =>
            tCase.id === caseId ? { ...tCase, status: newStatus } : tCase
        ));
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Triage & Emergency</h1>
                    <p className="text-gray-600 mt-2">Emergency assessment and priority management</p>
                </div>
                <button className="mt-4 md:mt-0 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    New Emergency Case
                </button>
            </div>

            {/* Alert Banner */}
            <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center">
                <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
                <div className="flex-1">
                    <p className="font-medium text-red-800">Emergency Mode Active</p>
                    <p className="text-sm text-red-600">
                        Currently {triageCases.filter(t => t.priority === 'RED').length} critical patients in queue
                    </p>
                </div>
                <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200">
                    View Critical Only
                </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                    <div className="relative flex-1 md:max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by patient name, ID, or complaint..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="flex space-x-3">
                        <select
                            value={selectedPriority}
                            onChange={(e) => setSelectedPriority(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {priorities.map(priority => (
                                <option key={priority.id} value={priority.id}>{priority.label}</option>
                            ))}
                        </select>

                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {statuses.map(status => (
                                <option key={status.id} value={status.id}>{status.label}</option>
                            ))}
                        </select>

                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center">
                            <Filter className="w-4 h-4 mr-2" />
                            More Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Priority Tabs */}
            <div className="mb-8">
                <div className="flex space-x-4">
                    {priorities.map(priority => (
                        <button
                            key={priority.id}
                            onClick={() => setSelectedPriority(priority.id)}
                            className={`flex-1 px-6 py-4 rounded-lg transition-colors duration-200 flex items-center justify-center ${selectedPriority === priority.id
                                    ? priority.id === 'RED' ? 'bg-red-600 text-white' :
                                        priority.id === 'YELLOW' ? 'bg-yellow-600 text-white' :
                                            priority.id === 'GREEN' ? 'bg-green-600 text-white' :
                                                'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
                                }`}
                        >
                            <div className={`w-3 h-3 rounded-full mr-3 ${priority.id === 'RED' ? 'bg-red-500' :
                                    priority.id === 'YELLOW' ? 'bg-yellow-500' :
                                        priority.id === 'GREEN' ? 'bg-green-500' :
                                            'bg-gray-500'
                                }`} />
                            {priority.label}
                            <span className="ml-2 px-2 py-1 text-xs rounded-full bg-white/20">
                                {triageCases.filter(t => t.priority === priority.id).length}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Triage Cases Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredCases.map(tCase => (
                    <div key={tCase.id} className={`bg-white rounded-xl shadow-md overflow-hidden border-2 ${getPriorityColor(tCase.priority)}`}>
                        {/* Case Header */}
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                        <User className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{tCase.patientName}</h3>
                                        <div className="flex items-center mt-1 space-x-4">
                                            <span className="text-sm text-gray-500">ID: {tCase.patientId}</span>
                                            <span className="text-sm text-gray-500">{tCase.age}y, {tCase.gender}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end space-y-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(tCase.priority)}`}>
                                        {tCase.priority} PRIORITY
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(tCase.status)}`}>
                                        {tCase.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            {/* Arrival Time */}
                            <div className="flex items-center text-gray-600 mb-4">
                                <Clock className="w-4 h-4 mr-2" />
                                <span className="text-sm">Arrived at {tCase.arrivalTime}</span>
                            </div>

                            {/* Chief Complaint */}
                            <div className="mb-6">
                                <h4 className="font-medium text-gray-900 mb-2">Chief Complaint</h4>
                                <p className="text-gray-700">{tCase.chiefComplaint}</p>
                                <div className="flex items-center mt-2">
                                    <span className="text-sm font-medium text-gray-700 mr-4">Pain Level:</span>
                                    <div className="flex items-center">
                                        {[...Array(10)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={`w-3 h-6 mx-0.5 rounded-sm ${i < tCase.painLevel
                                                        ? tCase.painLevel >= 7 ? 'bg-red-500' :
                                                            tCase.painLevel >= 4 ? 'bg-yellow-500' :
                                                                'bg-green-500'
                                                        : 'bg-gray-200'
                                                    }`}
                                            />
                                        ))}
                                        <span className="ml-3 font-bold text-gray-900">{tCase.painLevel}/10</span>
                                    </div>
                                </div>
                            </div>

                            {/* Vital Signs */}
                            <div className="mb-6">
                                <h4 className="font-medium text-gray-900 mb-3">Vital Signs</h4>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center justify-center mb-1">
                                            <Droplets className="w-4 h-4 text-red-500" />
                                        </div>
                                        <p className="text-xs text-gray-500">BP</p>
                                        <p className={`font-bold ${tCase.vitalSigns.bloodPressure > '140/90' ? 'text-red-600' : 'text-gray-900'
                                            }`}>
                                            {tCase.vitalSigns.bloodPressure}
                                        </p>
                                    </div>

                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center justify-center mb-1">
                                            <Heart className="w-4 h-4 text-red-500" />
                                        </div>
                                        <p className="text-xs text-gray-500">HR</p>
                                        <p className={`font-bold ${tCase.vitalSigns.heartRate > 100 ? 'text-red-600' : 'text-gray-900'
                                            }`}>
                                            {tCase.vitalSigns.heartRate} bpm
                                        </p>
                                    </div>

                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center justify-center mb-1">
                                            <Thermometer className="w-4 h-4 text-orange-500" />
                                        </div>
                                        <p className="text-xs text-gray-500">Temp</p>
                                        <p className={`font-bold ${tCase.vitalSigns.temperature > 37.5 ? 'text-red-600' : 'text-gray-900'
                                            }`}>
                                            {tCase.vitalSigns.temperature}°C
                                        </p>
                                    </div>

                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center justify-center mb-1">
                                            <Activity className="w-4 h-4 text-blue-500" />
                                        </div>
                                        <p className="text-xs text-gray-500">RR</p>
                                        <p className={`font-bold ${tCase.vitalSigns.respiratoryRate > 20 ? 'text-red-600' : 'text-gray-900'
                                            }`}>
                                            {tCase.vitalSigns.respiratoryRate}
                                        </p>
                                    </div>

                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center justify-center mb-1">
                                            <Activity className="w-4 h-4 text-green-500" />
                                        </div>
                                        <p className="text-xs text-gray-500">SpO₂</p>
                                        <p className={`font-bold ${tCase.vitalSigns.oxygenSaturation < 95 ? 'text-red-600' : 'text-gray-900'
                                            }`}>
                                            {tCase.vitalSigns.oxygenSaturation}%
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                <div className="flex space-x-2">
                                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200">
                                        <FileText className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex space-x-2">
                                    {tCase.status === 'waiting' && (
                                        <button
                                            onClick={() => updateCaseStatus(tCase.id, 'assessing')}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Start Assessment
                                        </button>
                                    )}

                                    {tCase.status === 'assessing' && (
                                        <>
                                            <button
                                                onClick={() => updateCaseStatus(tCase.id, 'admitted')}
                                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                                            >
                                                Admit
                                            </button>
                                            <button
                                                onClick={() => updateCaseStatus(tCase.id, 'discharged')}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                                            >
                                                Discharge
                                            </button>
                                        </>
                                    )}

                                    <button
                                        onClick={() => {/* Handle emergency transfer */ }}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                                    >
                                        Emergency
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredCases.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl shadow-md">
                    <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No triage cases found</h3>
                    <p className="text-gray-500">
                        {searchTerm || selectedPriority !== 'all' || selectedStatus !== 'all'
                            ? 'Try adjusting your search or filters'
                            : 'No emergency cases at the moment'}
                    </p>
                </div>
            )}

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-sm text-red-600 font-medium">Red Priority</p>
                    <p className="text-2xl font-bold text-red-900">
                        {triageCases.filter(t => t.priority === 'RED').length}
                    </p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-yellow-600 font-medium">Yellow Priority</p>
                    <p className="text-2xl font-bold text-yellow-900">
                        {triageCases.filter(t => t.priority === 'YELLOW').length}
                    </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600 font-medium">Green Priority</p>
                    <p className="text-2xl font-bold text-green-900">
                        {triageCases.filter(t => t.priority === 'GREEN').length}
                    </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">Avg Wait Time</p>
                    <p className="text-2xl font-bold text-blue-900">12m</p>
                </div>
            </div>

            {/* Emergency Protocols */}
            <div className="mt-8 bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Emergency Protocols</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors duration-200 text-left">
                        <h4 className="font-medium text-red-700 mb-2">Cardiac Arrest</h4>
                        <p className="text-sm text-gray-600">Initiate CPR and call code blue</p>
                    </button>

                    <button className="p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors duration-200 text-left">
                        <h4 className="font-medium text-red-700 mb-2">Severe Trauma</h4>
                        <p className="text-sm text-gray-600">Activate trauma team protocol</p>
                    </button>

                    <button className="p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors duration-200 text-left">
                        <h4 className="font-medium text-red-700 mb-2">Stroke Protocol</h4>
                        <p className="text-sm text-gray-600">Time-sensitive intervention required</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Triage;