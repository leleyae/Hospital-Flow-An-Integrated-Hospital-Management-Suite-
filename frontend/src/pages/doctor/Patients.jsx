// src/pages/doctor/Patients.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Search,
    Filter,
    User,
    Phone,
    Calendar,
    MoreVertical,
    Eye,
    FileText,
    Pill,
    Activity
} from 'lucide-react';
import doctorService from '../../services/doctorService';


const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        bloodGroup: '',
        lastVisit: '',
        hasAllergies: null
    });

    useEffect(() => {
        fetchPatients();
    }, []);

    useEffect(() => {
        filterPatients();
    }, [patients, searchTerm, filters]);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const response = await doctorService.getPatients();
            setPatients(response.patients || []);
        } catch (error) {
            console.error('Failed to fetch patients:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterPatients = () => {
        let filtered = patients;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(patient => {
                const fullName = `${patient.userId?.firstName || ''} ${patient.userId?.lastName || ''}`.toLowerCase();
                const email = patient.userId?.email?.toLowerCase() || '';
                const patientId = patient.patientId?.toLowerCase() || '';

                return (
                    fullName.includes(searchTerm.toLowerCase()) ||
                    email.includes(searchTerm.toLowerCase()) ||
                    patientId.includes(searchTerm.toLowerCase())
                );
            });
        }

        // Blood group filter
        if (filters.bloodGroup) {
            filtered = filtered.filter(patient => patient.bloodGroup === filters.bloodGroup);
        }

        // Last visit filter
        if (filters.lastVisit === 'week') {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            // This is a simplified filter - you'd need actual last visit data
        }

        // Allergies filter
        if (filters.hasAllergies !== null) {
            filtered = filtered.filter(patient =>
                filters.hasAllergies
                    ? patient.allergies && patient.allergies.length > 0
                    : !patient.allergies || patient.allergies.length === 0
            );
        }

        setFilteredPatients(filtered);
    };

    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

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
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
                <p className="text-gray-600 mt-2">Manage your patient records and information</p>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                    <div className="relative flex-1 md:max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search patients by name, ID, or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="flex space-x-3">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center"
                        >
                            <Filter className="w-4 h-4 mr-2" />
                            Filters
                        </button>
                    </div>
                </div>

                {/* Filter Options */}
                {showFilters && (
                    <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
<<<<<<< HEAD
                                <label className="block text-lg font-medium text-gray-700 mb-2">
=======
                                <label className="block text-sm font-medium text-gray-700 mb-2">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                    Blood Group
                                </label>
                                <select
                                    value={filters.bloodGroup}
                                    onChange={(e) => setFilters({ ...filters, bloodGroup: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">All Blood Groups</option>
                                    {bloodGroups.map(group => (
                                        <option key={group} value={group}>{group}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
<<<<<<< HEAD
                                <label className="block text-lg font-medium text-gray-700 mb-2">
=======
                                <label className="block text-sm font-medium text-gray-700 mb-2">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                    Last Visit
                                </label>
                                <select
                                    value={filters.lastVisit}
                                    onChange={(e) => setFilters({ ...filters, lastVisit: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Any Time</option>
                                    <option value="week">Last Week</option>
                                    <option value="month">Last Month</option>
                                    <option value="year">Last Year</option>
                                </select>
                            </div>

                            <div>
<<<<<<< HEAD
                                <label className="block text-lg font-medium text-gray-700 mb-2">
=======
                                <label className="block text-sm font-medium text-gray-700 mb-2">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                    Allergies
                                </label>
                                <select
                                    value={filters.hasAllergies === null ? '' : filters.hasAllergies.toString()}
                                    onChange={(e) => setFilters({
                                        ...filters,
                                        hasAllergies: e.target.value === '' ? null : e.target.value === 'true'
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">All Patients</option>
                                    <option value="true">Has Allergies</option>
                                    <option value="false">No Allergies</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => {
                                    setFilters({
                                        bloodGroup: '',
                                        lastVisit: '',
                                        hasAllergies: null
                                    });
                                    setSearchTerm('');
                                }}
                                className="px-4 py-2 text-gray-700 hover:text-gray-900"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Patients Grid */}
            {filteredPatients.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPatients.map((patient) => (
                        <div key={patient._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                            <div className="p-6">
                                {/* Patient Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center">
                                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                            <User className="w-8 h-8 text-blue-600" />
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="font-bold text-gray-900 text-lg">
                                                {patient.userId?.firstName} {patient.userId?.lastName}
                                            </h3>
<<<<<<< HEAD
                                            <p className="text-lg text-gray-500">ID: {patient.patientId}</p>
=======
                                            <p className="text-sm text-gray-500">ID: {patient.patientId}</p>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                        </div>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Patient Info */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center text-gray-600">
                                        <Phone className="w-4 h-4 mr-2" />
<<<<<<< HEAD
                                        <span className="text-lg">{patient.userId?.phoneNumber || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        <span className="text-lg">
=======
                                        <span className="text-sm">{patient.userId?.phoneNumber || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        <span className="text-sm">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                            {patient.bloodGroup ? `Blood Group: ${patient.bloodGroup}` : 'Blood Group: N/A'}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Activity className="w-4 h-4 mr-2" />
<<<<<<< HEAD
                                        <span className="text-lg">
=======
                                        <span className="text-sm">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                            {patient.height && patient.weight
                                                ? `${patient.height}cm, ${patient.weight}kg`
                                                : 'Vitals: N/A'}
                                        </span>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="grid grid-cols-3 gap-2">
                                    <Link
                                        to={`/doctor/patient-appointments/${patient._id}`}  // Changed route
                                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 flex flex-col items-center"
                                    >
                                        <Eye className="w-4 h-4 mb-1" />
<<<<<<< HEAD
                                        <span className="text-lg font-medium">View Appointments</span>  {/* Changed text */}
=======
                                        <span className="text-xs font-medium">View Appointments</span>  {/* Changed text */}
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                    </Link>

                                    <Link
                                        to={`/doctor/medical-records?patient=${patient._id}`}
                                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors duration-200 flex flex-col items-center"
                                    >
                                        <FileText className="w-4 h-4 mb-1" />
<<<<<<< HEAD
                                        <span className="text-lg font-medium">Records</span>
=======
                                        <span className="text-xs font-medium">Records</span>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                    </Link>

                                </div>
                            </div>

                            {/* Allergies */}
                            {patient.allergies && patient.allergies.length > 0 && (
                                <div className="bg-red-50 px-6 py-3 border-t border-red-100">
<<<<<<< HEAD
                                    <p className="text-lg font-medium text-red-700">
=======
                                    <p className="text-xs font-medium text-red-700">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                        ⚠️ Allergies: {patient.allergies.map(a => a.allergen).join(', ')}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-xl shadow-md">
                    <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
                    <p className="text-gray-500">
                        {searchTerm || Object.values(filters).some(f => f)
                            ? 'Try adjusting your search or filters'
                            : 'You have no patients yet'}
                    </p>
                </div>
            )}

            {/* Stats */}
            {patients.length > 0 && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
<<<<<<< HEAD
                        <p className="text-lg text-blue-600 font-medium">Total Patients</p>
=======
                        <p className="text-sm text-blue-600 font-medium">Total Patients</p>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                        <p className="text-2xl font-bold text-blue-900">{patients.length}</p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
<<<<<<< HEAD
                        <p className="text-lg text-green-600 font-medium">With Allergies</p>
=======
                        <p className="text-sm text-green-600 font-medium">With Allergies</p>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                        <p className="text-2xl font-bold text-green-900">
                            {patients.filter(p => p.allergies && p.allergies.length > 0).length}
                        </p>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
<<<<<<< HEAD
                        <p className="text-lg text-purple-600 font-medium">Blood Group O+</p>
=======
                        <p className="text-sm text-purple-600 font-medium">Blood Group O+</p>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                        <p className="text-2xl font-bold text-purple-900">
                            {patients.filter(p => p.bloodGroup === 'O+').length}
                        </p>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg">
<<<<<<< HEAD
                        <p className="text-lg text-yellow-600 font-medium">Recent (Last 7d)</p>
=======
                        <p className="text-sm text-yellow-600 font-medium">Recent (Last 7d)</p>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                        <p className="text-2xl font-bold text-yellow-900">0</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Patients;