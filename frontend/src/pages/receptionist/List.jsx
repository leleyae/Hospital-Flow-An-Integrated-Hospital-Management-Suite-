import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    FaSearch,
    FaFilter,
    FaEye,
    FaEdit,
    FaTrash,
    FaUserPlus,
    FaCalendarPlus,
    FaSort,
    FaSortUp,
    FaSortDown,
    FaPrint,
    FaFileExport,
    FaPhone,
    FaEnvelope,
    FaNotesMedical
} from 'react-icons/fa';
import {
    FiRefreshCw,
    FiChevronLeft,
    FiChevronRight,
    FiUserCheck,
    FiUserX
} from 'react-icons/fi';
import { MdEmergency, MdBloodtype } from 'react-icons/md';
import receptionistService from '../../services/receptionist.service';

const PatientList = () => {
    const navigate = useNavigate();

    // State
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Modal states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [patientToDelete, setPatientToDelete] = useState(null);
    const [showQuickView, setShowQuickView] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);

    // Fetch patients on mount
    useEffect(() => {
        fetchPatients();
    }, []);

    // Apply filters and search
    useEffect(() => {
        let result = [...patients];

        // Apply search
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(patient =>
                patient.userId?.firstName?.toLowerCase().includes(term) ||
                patient.userId?.lastName?.toLowerCase().includes(term) ||
                patient.patientId.toLowerCase().includes(term) ||
                patient.userId?.email?.toLowerCase().includes(term) ||
                patient.userId?.phoneNumber?.toLowerCase().includes(term)
            );
        }

        // Apply filters
        switch (selectedFilter) {
            case 'active':
                result = result.filter(p => p.status === 'active');
                break;
            case 'inactive':
                result = result.filter(p => p.status === 'inactive');
                break;
            case 'withInsurance':
                result = result.filter(p => p.insuranceProvider?.providerName);
                break;
            case 'noInsurance':
                result = result.filter(p => !p.insuranceProvider?.providerName);
                break;
            case 'recent':
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                result = result.filter(p => new Date(p.createdAt) > thirtyDaysAgo);
                break;
            // Add more filters as needed
        }

        // Apply sorting
        if (sortConfig.key) {
            result.sort((a, b) => {
                let aValue, bValue;

                switch (sortConfig.key) {
                    case 'name':
                        aValue = `${a.userId?.firstName || ''} ${a.userId?.lastName || ''}`.toLowerCase();
                        bValue = `${b.userId?.firstName || ''} ${b.userId?.lastName || ''}`.toLowerCase();
                        break;
                    case 'age':
                        aValue = calculateAge(a.userId?.dateOfBirth);
                        bValue = calculateAge(b.userId?.dateOfBirth);
                        break;
                    case 'registrationDate':
                        aValue = new Date(a.createdAt);
                        bValue = new Date(b.createdAt);
                        break;
                    case 'lastVisit':
                        aValue = new Date(a.lastVisit || 0);
                        bValue = new Date(b.lastVisit || 0);
                        break;
                    default:
                        aValue = a[sortConfig.key];
                        bValue = b[sortConfig.key];
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }

        setFilteredPatients(result);
        setCurrentPage(1); // Reset to first page when filters change
    }, [patients, searchTerm, selectedFilter, sortConfig]);

    // Calculate age from date of birth
    const calculateAge = (dateOfBirth) => {
        if (!dateOfBirth) return 0;
        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    // Calculate pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredPatients.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

    // Fetch patients from API
    const fetchPatients = async () => {
        try {
            setLoading(true);
            const response = await receptionistService.getAllPatients();
            setPatients(response.data.data);
            setFilteredPatients(response.data.data);
        } catch (error) {
            console.error('Error fetching patients:', error);
            alert('Failed to load patients');
        } finally {
            setLoading(false);
        }
    };

    // Handle sort
    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // Get sort icon
    const getSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return <FaSort className="text-gray-400" />;
        }
        return sortConfig.direction === 'ascending' ?
            <FaSortUp className="text-blue-500" /> :
            <FaSortDown className="text-blue-500" />;
    };

    // Handle delete
    const handleDelete = async () => {
        try {
            await receptionistService.deletePatient(patientToDelete._id);
            setPatients(patients.filter(p => p._id !== patientToDelete._id));
            setShowDeleteModal(false);
            setPatientToDelete(null);
            alert('Patient deleted successfully');
        } catch (error) {
            console.error('Error deleting patient:', error);
            alert('Failed to delete patient');
        }
    };

    // Quick view modal
    const openQuickView = (patient) => {
        setSelectedPatient(patient);
        setShowQuickView(true);
    };

    // Export functions
    const exportToCSV = () => {
        const headers = ['Patient ID', 'Name', 'Age', 'Gender', 'Phone', 'Email', 'Blood Group', 'Registration Date', 'Status'];
        const csvContent = [
            headers.join(','),
            ...filteredPatients.map(p => [
                p.patientId,
                `${p.userId?.firstName} ${p.userId?.lastName}`,
                calculateAge(p.userId?.dateOfBirth),
                p.userId?.gender || 'N/A',
                p.userId?.phoneNumber || 'N/A',
                p.userId?.email || 'N/A',
                p.bloodGroup || 'N/A',
                new Date(p.createdAt).toLocaleDateString(),
                p.status || 'active'
            ].map(item => `"${item}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `patients_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    // Print patient list
    const printPatientList = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Patient List</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f4f4f4; }
                        h1 { color: #333; }
                        .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
                        .date { color: #666; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Patient List</h1>
                        <div class="date">Generated: ${new Date().toLocaleString()}</div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Patient ID</th>
                                <th>Name</th>
                                <th>Age</th>
                                <th>Gender</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Blood Group</th>
                                <th>Registration Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredPatients.map(p => `
                                <tr>
                                    <td>${p.patientId}</td>
                                    <td>${p.userId?.firstName} ${p.userId?.lastName}</td>
                                    <td>${calculateAge(p.userId?.dateOfBirth)}</td>
                                    <td>${p.userId?.gender || 'N/A'}</td>
                                    <td>${p.userId?.phoneNumber || 'N/A'}</td>
                                    <td>${p.userId?.email || 'N/A'}</td>
                                    <td>${p.bloodGroup || 'N/A'}</td>
                                    <td>${new Date(p.createdAt).toLocaleDateString()}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div style="margin-top: 20px; color: #666;">
                        Total Patients: ${filteredPatients.length}
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    // Status badge component
    const StatusBadge = ({ status }) => {
        const statusConfig = {
            active: { color: 'bg-green-100 text-green-800', icon: <FiUserCheck className="mr-1" />, text: 'Active' },
            inactive: { color: 'bg-red-100 text-red-800', icon: <FiUserX className="mr-1" />, text: 'Inactive' },
            pending: { color: 'bg-yellow-100 text-yellow-800', icon: null, text: 'Pending' }
        };

        const config = statusConfig[status] || statusConfig.active;

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                {config.icon}
                {config.text}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Management</h1>
                            <p className="text-gray-600">Manage and search patient records</p>
                        </div>

                        <div className="flex space-x-3 mt-4 md:mt-0">
                            <button
                                onClick={() => navigate('/receptionist/register-patient')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                            >
                                <FaUserPlus className="mr-2" />
                                Register New
                            </button>
                            <button
                                onClick={() => navigate('/receptionist/appointment-scheduling')}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center"
                            >
                                <FaCalendarPlus className="mr-2" />
                                Schedule Visit
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <FaUserPlus className="text-blue-600 text-xl" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-lg text-gray-500">Total Patients</p>
                                    <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <FiUserCheck className="text-green-600 text-xl" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-lg text-gray-500">Active Patients</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {patients.filter(p => p.status === 'active').length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="flex items-center">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <FaCalendarPlus className="text-yellow-600 text-xl" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-lg text-gray-500">Today's Appointments</p>
                                    <p className="text-2xl font-bold text-gray-900">0</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="flex items-center">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <MdBloodtype className="text-purple-600 text-xl" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-lg text-gray-500">Without Blood Group</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {patients.filter(p => !p.bloodGroup).length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white rounded-lg shadow mb-6">
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                            {/* Search */}
                            <div className="flex-1">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaSearch className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search by name, ID, phone, or email..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Filters and Actions */}
                            <div className="flex flex-wrap gap-3">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaFilter className="text-gray-400" />
                                    </div>
                                    <select
                                        value={selectedFilter}
                                        onChange={(e) => setSelectedFilter(e.target.value)}
                                        className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                                    >
                                        <option value="all">All Patients</option>
                                        <option value="active">Active Only</option>
                                        <option value="inactive">Inactive Only</option>
                                        <option value="withInsurance">With Insurance</option>
                                        <option value="noInsurance">Without Insurance</option>
                                        <option value="recent">Registered Last 30 Days</option>
                                    </select>
                                </div>

                                <button
                                    onClick={fetchPatients}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
                                    title="Refresh"
                                >
                                    <FiRefreshCw className={`${loading ? 'animate-spin' : ''}`} />
                                </button>

                                <button
                                    onClick={exportToCSV}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
                                    title="Export to CSV"
                                >
                                    <FaFileExport className="mr-2" />
                                    Export
                                </button>

                                <button
                                    onClick={printPatientList}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
                                    title="Print"
                                >
                                    <FaPrint className="mr-2" />
                                    Print
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Patient Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <button
                                                    onClick={() => requestSort('patientId')}
                                                    className="flex items-center space-x-1 hover:text-gray-700"
                                                >
                                                    <span>Patient ID</span>
                                                    {getSortIcon('patientId')}
                                                </button>
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <button
                                                    onClick={() => requestSort('name')}
                                                    className="flex items-center space-x-1 hover:text-gray-700"
                                                >
                                                    <span>Patient Name</span>
                                                    {getSortIcon('name')}
                                                </button>
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <button
                                                    onClick={() => requestSort('age')}
                                                    className="flex items-center space-x-1 hover:text-gray-700"
                                                >
                                                    <span>Age/Gender</span>
                                                    {getSortIcon('age')}
                                                </button>
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Contact Info
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Medical Info
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <button
                                                    onClick={() => requestSort('registrationDate')}
                                                    className="flex items-center space-x-1 hover:text-gray-700"
                                                >
                                                    <span>Registered On</span>
                                                    {getSortIcon('registrationDate')}
                                                </button>
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
                                        {currentItems.length === 0 ? (
                                            <tr>
                                                <td colSpan="8" className="px-6 py-12 text-center">
                                                    <div className="text-gray-400">
                                                        <FaSearch className="text-4xl mx-auto mb-3" />
                                                        <p className="text-lg">No patients found</p>
                                                        <p className="text-lg mt-1">Try adjusting your search or filter</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            currentItems.map((patient) => (
                                                <tr key={patient._id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-lg font-medium text-blue-600">
                                                            {patient.patientId}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                                <span className="text-blue-600 font-semibold">
                                                                    {patient.userId?.firstName?.[0]}{patient.userId?.lastName?.[0]}
                                                                </span>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-lg font-medium text-gray-900">
                                                                    {patient.userId?.firstName} {patient.userId?.lastName}
                                                                </div>
                                                                <div className="text-lg text-gray-500">
                                                                    {patient.userId?.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-lg text-gray-900">
                                                            {calculateAge(patient.userId?.dateOfBirth)} years
                                                        </div>
                                                        <div className="text-lg text-gray-500">
                                                            {patient.userId?.gender || 'Not specified'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex flex-col space-y-1">
                                                            {patient.userId?.phoneNumber && (
                                                                <div className="flex items-center text-lg text-gray-600">
                                                                    <FaPhone className="mr-2 text-gray-400" />
                                                                    {patient.userId.phoneNumber}
                                                                </div>
                                                            )}
                                                            {patient.emergencyContact?.phoneNumber && (
                                                                <div className="flex items-center text-lg text-gray-600">
                                                                    <MdEmergency className="mr-2 text-red-400" />
                                                                    {patient.emergencyContact.name} ({patient.emergencyContact.relationship})
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex flex-col space-y-1">
                                                            {patient.bloodGroup && (
                                                                <div className="flex items-center text-lg">
                                                                    <MdBloodtype className="mr-2 text-red-500" />
                                                                    <span className="font-medium">{patient.bloodGroup}</span>
                                                                </div>
                                                            )}
                                                            {(patient.height || patient.weight) && (
                                                                <div className="text-lg text-gray-600">
                                                                    {patient.height && `${patient.height} cm`}
                                                                    {patient.height && patient.weight && ' • '}
                                                                    {patient.weight && `${patient.weight} kg`}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-500">
                                                        {new Date(patient.createdAt).toLocaleDateString()}
                                                        <div className="text-xs text-gray-400">
                                                            {new Date(patient.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <StatusBadge status={patient.status || 'active'} />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-lg font-medium">
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => openQuickView(patient)}
                                                                className="text-blue-600 hover:text-blue-900 p-1"
                                                                title="Quick View"
                                                            >
                                                                <FaEye />
                                                            </button>
                                                            <button
                                                                onClick={() => navigate(`/receptionist/appointment-scheduling?patientId=${patient._id}`)}
                                                                className="text-purple-600 hover:text-purple-900 p-1"
                                                                title="Schedule Appointment"
                                                            >
                                                                <FaCalendarPlus />
                                                            </button>

                                                            <button
                                                                onClick={() => navigate(`/receptionist/patients/${patient._id}/edit`)}
                                                                className="text-yellow-600 hover:text-yellow-900 p-1"
                                                                title="Edit"
                                                            >
                                                                <FaEdit />
                                                            </button>
                                                            <button
                                                                onClick={() => navigate(`/receptionist/patients/${patient._id}/medical-records`)}
                                                                className="text-green-600 hover:text-green-900 p-1"
                                                                title="Medical Records"
                                                            >
                                                                <FaNotesMedical />
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setPatientToDelete(patient);
                                                                    setShowDeleteModal(true);
                                                                }}
                                                                className="text-red-600 hover:text-red-900 p-1"
                                                                title="Delete"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {filteredPatients.length > itemsPerPage && (
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                        <div className="mb-4 md:mb-0">
                                            <p className="text-lg text-gray-700">
                                                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                                                <span className="font-medium">
                                                    {Math.min(indexOfLastItem, filteredPatients.length)}
                                                </span> of{' '}
                                                <span className="font-medium">{filteredPatients.length}</span> patients
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                                className="px-3 py-1 border border-gray-300 rounded-md text-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                            >
                                                <FiChevronLeft className="mr-1" />
                                                Previous
                                            </button>

                                            <div className="flex space-x-1">
                                                {[...Array(totalPages)].map((_, i) => {
                                                    const pageNumber = i + 1;
                                                    // Show only first, last, and pages around current
                                                    if (
                                                        pageNumber === 1 ||
                                                        pageNumber === totalPages ||
                                                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                                    ) {
                                                        return (
                                                            <button
                                                                key={pageNumber}
                                                                onClick={() => setCurrentPage(pageNumber)}
                                                                className={`px-3 py-1 text-lg font-medium rounded-md ${currentPage === pageNumber
                                                                    ? 'bg-blue-600 text-white'
                                                                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                                    }`}
                                                            >
                                                                {pageNumber}
                                                            </button>
                                                        );
                                                    }

                                                    // Show ellipsis for skipped pages
                                                    if (
                                                        pageNumber === currentPage - 2 ||
                                                        pageNumber === currentPage + 2
                                                    ) {
                                                        return (
                                                            <span key={pageNumber} className="px-2 py-1 text-gray-500">
                                                                ...
                                                            </span>
                                                        );
                                                    }

                                                    return null;
                                                })}
                                            </div>

                                            <button
                                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                disabled={currentPage === totalPages}
                                                className="px-3 py-1 border border-gray-300 rounded-md text-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                            >
                                                Next
                                                <FiChevronRight className="ml-1" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && patientToDelete && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <FaTrash className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Patient</h3>
                            <p className="text-lg text-gray-500 mb-4">
                                Are you sure you want to delete <strong>{patientToDelete.userId?.firstName} {patientToDelete.userId?.lastName}</strong>?
                                This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setPatientToDelete(null);
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-md text-lg font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md text-lg font-medium hover:bg-red-700"
                            >
                                Delete Patient
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick View Modal */}
            {showQuickView && selectedPatient && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">
                                    Patient Details
                                </h3>
                                <p className="text-lg text-gray-500">{selectedPatient.patientId}</p>
                            </div>
                            <button
                                onClick={() => setShowQuickView(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Personal Info */}
                            <div>
                                <h4 className="font-medium text-gray-700 mb-3 pb-2 border-b">Personal Information</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Name:</span>
                                        <span className="font-medium">
                                            {selectedPatient.userId?.firstName} {selectedPatient.userId?.lastName}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Date of Birth:</span>
                                        <span>{selectedPatient.userId?.dateOfBirth || 'Not specified'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Age:</span>
                                        <span>{calculateAge(selectedPatient.userId?.dateOfBirth)} years</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Gender:</span>
                                        <span>{selectedPatient.userId?.gender || 'Not specified'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div>
                                <h4 className="font-medium text-gray-700 mb-3 pb-2 border-b">Contact Information</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <FaPhone className="text-gray-400 mr-2" />
                                        <span>{selectedPatient.userId?.phoneNumber || 'Not specified'}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FaEnvelope className="text-gray-400 mr-2" />
                                        <span>{selectedPatient.userId?.email || 'Not specified'}</span>
                                    </div>
                                    {selectedPatient.userId?.address && (
                                        <div>
                                            <div className="text-gray-600 text-lg mb-1">Address:</div>
                                            <div className="text-lg">
                                                {selectedPatient.userId.address.street && (
                                                    <div>{selectedPatient.userId.address.street}</div>
                                                )}
                                                {selectedPatient.userId.address.city && (
                                                    <div>{selectedPatient.userId.address.city}, {selectedPatient.userId.address.state} {selectedPatient.userId.address.zipCode}</div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Medical Info */}
                            <div>
                                <h4 className="font-medium text-gray-700 mb-3 pb-2 border-b">Medical Information</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Blood Group:</span>
                                        <span className="font-medium">
                                            {selectedPatient.bloodGroup || 'Not specified'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Height:</span>
                                        <span>{selectedPatient.height || 'Not specified'} cm</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Weight:</span>
                                        <span>{selectedPatient.weight || 'Not specified'} kg</span>
                                    </div>
                                    {selectedPatient.allergies && selectedPatient.allergies.length > 0 && (
                                        <div>
                                            <div className="text-gray-600 text-lg mb-1">Allergies:</div>
                                            <div className="text-lg">{selectedPatient.allergies.join(', ')}</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Emergency Contact */}
                            <div>
                                <h4 className="font-medium text-gray-700 mb-3 pb-2 border-b">Emergency Contact</h4>
                                {selectedPatient.emergencyContact?.name ? (
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Name:</span>
                                            <span className="font-medium">{selectedPatient.emergencyContact.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Relationship:</span>
                                            <span>{selectedPatient.emergencyContact.relationship}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Phone:</span>
                                            <span>{selectedPatient.emergencyContact.phoneNumber}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-lg">No emergency contact provided</p>
                                )}
                            </div>

                            {/* Insurance */}
                            {selectedPatient.insuranceProvider?.providerName && (
                                <div className="md:col-span-2">
                                    <h4 className="font-medium text-gray-700 mb-3 pb-2 border-b">Insurance Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <div className="text-gray-600 text-lg mb-1">Provider:</div>
                                            <div className="font-medium">{selectedPatient.insuranceProvider.providerName}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-600 text-lg mb-1">Policy Number:</div>
                                            <div className="font-medium">{selectedPatient.insuranceProvider.policyNumber}</div>
                                        </div>
                                        {selectedPatient.insuranceProvider.validUntil && (
                                            <div>
                                                <div className="text-gray-600 text-lg mb-1">Valid Until:</div>
                                                <div>{new Date(selectedPatient.insuranceProvider.validUntil).toLocaleDateString()}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
// In PatientList.jsx - Add in the quick view modal's action buttons:
                        <div className="mt-6 pt-6 border-t flex justify-end space-x-3">
                            <button
                                onClick={() => navigate(`/receptionist/patients/${selectedPatient._id}/edit`)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Edit Patient
                            </button>
                            <button
                                onClick={() => {
                                    setShowQuickView(false);
                                    navigate(`/receptionist/appointment-scheduling?patientId=${selectedPatient._id}`);
                                }}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                Schedule Appointment
                            </button>
                            {/* ADD THIS NEW BUTTON FOR INSTANT SCHEDULING */}
                            <button
                                onClick={() => {
                                    setShowQuickView(false);
                                    navigate(`/receptionist/appointment-scheduling?patientId=${selectedPatient._id}&quickSchedule=true`);
                                }}
                                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                            >
                                Schedule Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientList;