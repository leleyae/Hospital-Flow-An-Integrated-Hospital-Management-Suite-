// src/pages/doctor/MedicalRecords.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Search,
    Filter,
    Plus,
    FileText,
    User,
    Calendar,
    Stethoscope,
    Download,
    Eye,
    Edit,
    MoreVertical,
    ClipboardList,
    Activity,
    Pill
} from 'lucide-react';
import doctorService from '../../services/doctorService';


const MedicalRecords = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [selectedPatient, setSelectedPatient] = useState('all');

    const recordTypes = [
        { id: 'all', label: 'All Types', icon: FileText, color: 'gray' },
        { id: 'consultation', label: 'Consultation', icon: Stethoscope, color: 'blue' },
        { id: 'diagnosis', label: 'Diagnosis', icon: ClipboardList, color: 'green' },
        { id: 'procedure', label: 'Procedure', icon: Activity, color: 'purple' },
        { id: 'admission', label: 'Admission', icon: Pill, color: 'red' },
        { id: 'discharge', label: 'Discharge', icon: Download, color: 'yellow' },
    ];

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            setLoading(true);
            // This would typically fetch from a specific endpoint
            // For now, we'll simulate with a placeholder
            setRecords([]);
        } catch (error) {
            console.error('Failed to fetch medical records:', error);
        } finally {
            setLoading(false);
        }
    };



    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
                    <p className="text-gray-600 mt-2">Access and manage patient medical records</p>
                </div>
                <Link
                    to="/doctor/medical-records/new"
                    className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New Record
                </Link>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                    <div className="relative flex-1 md:max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by patient name, diagnosis, or record ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="flex space-x-3">
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {recordTypes.map(type => (
                                <option key={type.id} value={type.id}>{type.label}</option>
                            ))}
                        </select>

                        <select
                            value={selectedPatient}
                            onChange={(e) => setSelectedPatient(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Patients</option>
                            {/* Patient options would be populated from API */}
                        </select>

                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center">
                            <Filter className="w-4 h-4 mr-2" />
                            More Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Type Filters */}
            <div className="mb-8">
                <div className="flex flex-wrap gap-3">
                    {recordTypes.map(type => (
                        <button
                            key={type.id}
                            onClick={() => setSelectedType(type.id)}
                            className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${selectedType === type.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
                                }`}
                        >
                            <type.icon className={`w-4 h-4 mr-2 ${selectedType === type.id ? 'text-white' : `text-${type.color}-600`
                                }`} />
                            {type.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Records Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Example Record 1 */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                    <Stethoscope className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Initial Consultation</h3>
                                    <div className="flex items-center mt-1">
                                        <User className="w-3 h-3 text-gray-400 mr-1" />
                                        <span className="text-sm text-gray-600">John Doe</span>
                                        <span className="mx-2 text-gray-300">•</span>
                                        <Calendar className="w-3 h-3 text-gray-400 mr-1" />
                                        <span className="text-sm text-gray-600">Dec 15, 2023</span>
                                    </div>
                                </div>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">Chief Complaint</h4>
                            <p className="text-gray-600">Persistent headache and fatigue for 2 weeks</p>
                        </div>

                        <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">Diagnosis</h4>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                    Migraine
                                </span>
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                    Vitamin D Deficiency
                                </span>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">Prescribed Medications</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                    <span className="text-sm text-gray-900">Sumatriptan</span>
                                    <span className="text-xs text-gray-500">50mg, as needed</span>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                    <span className="text-sm text-gray-900">Vitamin D3</span>
                                    <span className="text-xs text-gray-500">2000 IU, daily</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                            <div className="flex space-x-2">
                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                                    <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                                    <Download className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200">
                                    <Edit className="w-4 h-4" />
                                </button>
                            </div>
                            <span className="text-xs text-gray-500">Record #MR00123</span>
                        </div>
                    </div>
                </div>

                {/* Example Record 2 */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                                    <Activity className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Procedure Report</h3>
                                    <div className="flex items-center mt-1">
                                        <User className="w-3 h-3 text-gray-400 mr-1" />
                                        <span className="text-sm text-gray-600">Jane Smith</span>
                                        <span className="mx-2 text-gray-300">•</span>
                                        <Calendar className="w-3 h-3 text-gray-400 mr-1" />
                                        <span className="text-sm text-gray-600">Nov 30, 2023</span>
                                    </div>
                                </div>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">Procedure</h4>
                            <p className="text-gray-600">Knee Arthroscopy - Meniscus Repair</p>
                        </div>

                        <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">Findings</h4>
                            <ul className="list-disc list-inside text-gray-600 space-y-1">
                                <li>Medial meniscus tear confirmed</li>
                                <li>Minimal synovitis observed</li>
                                <li>Cartilage Grade I-II changes</li>
                            </ul>
                        </div>

                        <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">Post-op Instructions</h4>
                            <p className="text-gray-600 text-sm">
                                Weight-bearing as tolerated with crutches for 2 weeks.
                                Physical therapy to begin 48 hours post-op.
                            </p>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                            <div className="flex space-x-2">
                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                                    <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                            <span className="text-xs text-gray-500">Record #PR00456</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Empty State */}
            {records.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl shadow-md mt-6">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No medical records found</h3>
                    <p className="text-gray-500 mb-6">
                        {searchTerm || selectedType !== 'all' || selectedPatient !== 'all'
                            ? 'Try adjusting your search or filters'
                            : 'Start by creating your first medical record'}
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Link
                            to="/doctor/medical-records/new"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Record
                        </Link>
                        <Link
                            to="/doctor/patients"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                            <User className="w-4 h-4 mr-2" />
                            View Patients
                        </Link>
                    </div>
                </div>
            )}

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">Total Records</p>
                    <p className="text-2xl font-bold text-blue-900">0</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600 font-medium">Consultations</p>
                    <p className="text-2xl font-bold text-green-900">0</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-600 font-medium">Procedures</p>
                    <p className="text-2xl font-bold text-purple-900">0</p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-yellow-600 font-medium">This Month</p>
                    <p className="text-2xl font-bold text-yellow-900">0</p>
                </div>
            </div>
        </div>
    );
};

export default MedicalRecords;