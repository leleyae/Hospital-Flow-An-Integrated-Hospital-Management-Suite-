<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaCalendarAlt,
    FaUserMd,
    FaUser,
    FaClock,
    FaFilter,
    FaSearch,
    FaEye
} from 'react-icons/fa';
import { FiCalendar, FiClock, FiRefreshCw } from 'react-icons/fi';
import receptionistService from '../../services/receptionist.service';

const AppointmentList = () => {
    const navigate = useNavigate();

    // State
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // all, today, upcoming, completed, cancelled

    // Fetch appointments on mount
    useEffect(() => {
        fetchAppointments();
    }, []);

    // Filter appointments based on search and filter
    const filteredAppointments = appointments.filter(appointment => {
        // Search filter
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
            appointment.patientId?.userId?.firstName?.toLowerCase().includes(searchLower) ||
            appointment.patientId?.userId?.lastName?.toLowerCase().includes(searchLower) ||
            appointment.doctorId?.firstName?.toLowerCase().includes(searchLower) ||
            appointment.doctorId?.lastName?.toLowerCase().includes(searchLower) ||
            appointment.appointmentId?.toLowerCase().includes(searchLower) ||
            appointment.reason?.toLowerCase().includes(searchLower);

        // Date filter
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const appointmentDate = new Date(appointment.appointmentDate);

        switch (filter) {
            case 'today':
                return matchesSearch && appointmentDate.toDateString() === today.toDateString();
            case 'upcoming':
                return matchesSearch && appointmentDate >= today && appointment.status !== 'completed' && appointment.status !== 'cancelled';
            case 'completed':
                return matchesSearch && appointment.status === 'completed';
            case 'cancelled':
                return matchesSearch && appointment.status === 'cancelled';
            default:
                return matchesSearch;
        }
    });

    // Fetch appointments from API
    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const response = await receptionistService.getAllAppointments();
            setAppointments(response.data.data || []);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            alert('Failed to load appointments');
=======
// src/pages/receptionist/DashboardHome.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FaUsers,
    FaCalendarCheck,
    FaMoneyBillWave,
    FaBed,
    FaClock,
    FaExclamationTriangle,
    FaUserPlus,
    FaCheckCircle
} from 'react-icons/fa';
import receptionistService from '../../services/receptionist.service';


const DashboardHome = () => {
    const [stats, setStats] = useState({
        totalPatients: 0,
        activePatients: 0,
        todaysAppointments: 0,
        pendingAppointments: 0,
        availableRooms: 0,
        pendingBills: 0,
        totalRevenue: 0
    });
    const [loading, setLoading] = useState(true);
    const [todaysAppointments, setTodaysAppointments] = useState([]);
    const [recentPatients, setRecentPatients] = useState([]);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);

            // Load dashboard stats
            const statsData = await receptionistService.getDashboardStats();
            setStats(statsData.data);

            // Load today's appointments
            const today = new Date().toISOString().split('T')[0];
            const appointmentsData = await receptionistService.getAppointments({ date: today });
            setTodaysAppointments(appointmentsData.data.appointments.slice(0, 5));

            // Load recent patients
            const patientsData = await receptionistService.getPatients();
            setRecentPatients(patientsData.data.patients.slice(0, 5));

        } catch (error) {
            console.error('Error loading dashboard data:', error);
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
        } finally {
            setLoading(false);
        }
    };

<<<<<<< HEAD
    // Get status badge
    const getStatusBadge = (status) => {
        const statusConfig = {
            scheduled: { color: 'bg-blue-100 text-blue-800', text: 'Scheduled' },
            confirmed: { color: 'bg-green-100 text-green-800', text: 'Confirmed' },
            completed: { color: 'bg-gray-100 text-gray-800', text: 'Completed' },
            cancelled: { color: 'bg-red-100 text-red-800', text: 'Cancelled' },
            noShow: { color: 'bg-orange-100 text-orange-800', text: 'No Show' }
        };

        const config = statusConfig[status] || statusConfig.scheduled;

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-lg font-medium ${config.color}`}>
=======
    const StatCard = ({ icon: Icon, title, value, color, link, subtitle }) => (
        <Link to={link} className="block">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                    <div className={`p-3 rounded-full ${color} bg-opacity-20`}>
                        <Icon className={`text-2xl ${color.split(' ')[1]}`} />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">{title}</p>
                        <p className="text-2xl font-semibold text-gray-900">
                            {loading ? '...' : value}
                        </p>
                        {subtitle && (
                            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );

    const getAppointmentStatusBadge = (status) => {
        const statusConfig = {
            'scheduled': { color: 'bg-blue-100 text-blue-800', text: 'Scheduled' },
            'confirmed': { color: 'bg-green-100 text-green-800', text: 'Confirmed' },
            'checked-in': { color: 'bg-purple-100 text-purple-800', text: 'Checked In' },
            'in-progress': { color: 'bg-yellow-100 text-yellow-800', text: 'In Progress' },
            'pending': { color: 'bg-gray-100 text-gray-800', text: 'Pending' }
        };

        const config = statusConfig[status] || statusConfig.pending;
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                {config.text}
            </span>
        );
    };

<<<<<<< HEAD
    // Format time
    const formatTime = (time) => {
        return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Appointments</h1>
                            <p className="text-gray-600">View and manage all appointments</p>
                        </div>

                        <div className="flex space-x-3 mt-4 md:mt-0">
                            <button
                                onClick={() => navigate('/receptionist/appointment-scheduling')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                            >
                                <FaCalendarAlt className="mr-2" />
                                Schedule New
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FaCalendarAlt className="text-blue-600 text-xl" />
                            </div>
                            <div className="ml-4">
                                <p className="text-lg text-gray-500">Total Appointments</p>
                                <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <FiCalendar className="text-green-600 text-xl" />
                            </div>
                            <div className="ml-4">
                                <p className="text-lg text-gray-500">Today's Appointments</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {appointments.filter(a => {
                                        const today = new Date();
                                        const appDate = new Date(a.appointmentDate);
                                        return appDate.toDateString() === today.toDateString();
                                    }).length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <FaClock className="text-yellow-600 text-xl" />
                            </div>
                            <div className="ml-4">
                                <p className="text-lg text-gray-500">Upcoming</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {appointments.filter(a => {
                                        const today = new Date();
                                        const appDate = new Date(a.appointmentDate);
                                        return appDate >= today && a.status !== 'completed' && a.status !== 'cancelled';
                                    }).length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex items-center">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <FaUserMd className="text-gray-600 text-xl" />
                            </div>
                            <div className="ml-4">
                                <p className="text-lg text-gray-500">Doctors on Duty</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {[...new Set(appointments.map(a => a.doctorId?._id))].length}
                                </p>
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
                                        placeholder="Search by patient name, doctor, appointment ID, or reason..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="flex flex-wrap gap-3">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaFilter className="text-gray-400" />
                                    </div>
                                    <select
                                        value={filter}
                                        onChange={(e) => setFilter(e.target.value)}
                                        className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                                    >
                                        <option value="all">All Appointments</option>
                                        <option value="today">Today</option>
                                        <option value="upcoming">Upcoming</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>

                                <button
                                    onClick={fetchAppointments}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
                                    title="Refresh"
                                >
                                    <FiRefreshCw className={`${loading ? 'animate-spin' : ''}`} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Appointments Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : filteredAppointments.length === 0 ? (
                        <div className="text-center py-12">
                            <FaCalendarAlt className="text-4xl text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 text-lg">No appointments found</p>
                            <p className="text-gray-400 mt-1">Try changing your search or filter</p>
                            <button
                                onClick={() => navigate('/receptionist/appointment-scheduling')}
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Schedule Your First Appointment
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                                            Appointment ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                                            Patient
                                        </th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                                            Doctor
                                        </th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                                            Date & Time
                                        </th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                                            Reason
                                        </th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredAppointments.map((appointment) => (
                                        <tr key={appointment._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-lg font-mono text-blue-600">
                                                    {appointment.appointmentId}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <FaUser className="text-blue-600" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-lg font-medium text-gray-900">
                                                            {appointment.patientId?.userId?.firstName} {appointment.patientId?.userId?.lastName}
                                                        </div>
                                                        <div className="text-lg text-gray-500">
                                                            {appointment.patientId?.patientId}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-lg text-gray-900">
                                                    Dr. {appointment.doctorId?.firstName} {appointment.doctorId?.lastName}
                                                </div>
                                                <div className="text-lg text-gray-500">
                                                    {appointment.doctorId?.specialization || 'General'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-lg text-gray-900">
                                                    <div className="flex items-center">
                                                        <FiCalendar className="mr-2 text-gray-400" />
                                                        {formatDate(appointment.appointmentDate)}
                                                    </div>
                                                    <div className="flex items-center mt-1">
                                                        <FiClock className="mr-2 text-gray-400" />
                                                        {formatTime(appointment.appointmentTime)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-lg text-gray-900 max-w-xs truncate">
                                                    {appointment.reason}
                                                </div>
                                                <div className="text-lg text-gray-500 mt-1">
                                                    {appointment.type}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(appointment.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-lg font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => navigate(`/receptionist/appointments/${appointment._id}`)}
                                                        className="text-blue-600 hover:text-blue-900 p-1"
                                                        title="View Details"
                                                    >
                                                        <FaEye />
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/receptionist/appointments/${appointment._id}/edit`)}
                                                        className="text-yellow-600 hover:text-yellow-900 p-1"
                                                        title="Edit"
                                                    >
                                                        Edit
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Quick Stats Footer */}
                <div className="mt-6 text-center text-gray-500 text-lg">
                    Showing {filteredAppointments.length} of {appointments.length} appointments
=======
    const getPatientStatusBadge = (status) => {
        return status === 'active' ? (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
            </span>
        ) : (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Inactive
            </span>
        );
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Reception Dashboard</h1>
                <p className="text-gray-600">Welcome back! Heres whats happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    icon={FaUsers}
                    title="Total Patients"
                    value={stats.totalPatients}
                    color="text-blue-500"
                    link="/receptionist/patient-registration"
                />
                <StatCard
                    icon={FaCalendarCheck}
                    title="Today's Appointments"
                    value={stats.todaysAppointments}
                    color="text-green-500"
                    link="/receptionist/check-in"
                    subtitle={`${stats.pendingAppointments} pending`}
                />
                <StatCard
                    icon={FaMoneyBillWave}
                    title="Pending Bills"
                    value={stats.pendingBills}
                    color="text-yellow-500"
                    link="/receptionist/billing"
                    subtitle={`Revenue: ${formatCurrency(stats.totalRevenue)}`}
                />
                <StatCard
                    icon={FaBed}
                    title="Available Rooms"
                    value={stats.availableRooms}
                    color="text-purple-500"
                    link="/receptionist/room-management"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Today's Appointments */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Todays Appointments</h2>
                        <Link
                            to="/receptionist/check-in"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            View All →
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {todaysAppointments.length > 0 ? (
                            todaysAppointments.map((appointment, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                    <div>
                                        <p className="font-medium text-gray-900">{appointment.patientName}</p>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <FaClock className="mr-1" />
                                            {appointment.time} • {appointment.doctorName}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {getAppointmentStatusBadge(appointment.status)}
                                        <p className="text-xs text-gray-500 mt-1">{appointment.type}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">No appointments today</p>
                        )}
                    </div>
                </div>

                {/* Recent Patients */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Patients</h2>
                        <Link
                            to="/receptionist/patient-registration"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            View All →
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentPatients.length > 0 ? (
                            recentPatients.map((patient, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {patient.firstName} {patient.lastName}
                                        </p>
                                        <p className="text-sm text-gray-500">ID: {patient.patientId}</p>
                                    </div>
                                    <div className="text-right">
                                        {getPatientStatusBadge(patient.status)}
                                        <p className="text-xs text-gray-500 mt-1">
                                            {patient.age} years • {patient.gender}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">No recent patients</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link
                        to="/receptionist/patient-registration?action=new"
                        className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                        <FaUserPlus className="text-2xl text-blue-600 mb-2" />
                        <span className="font-medium text-gray-900">Register Patient</span>
                    </Link>

                    <Link
                        to="/receptionist/check-in?action=checkin"
                        className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                    >
                        <FaCheckCircle className="text-2xl text-green-600 mb-2" />
                        <span className="font-medium text-gray-900">Check-in Patient</span>
                    </Link>

                    <Link
                        to="/receptionist/billing?action=new"
                        className="flex flex-col items-center justify-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
                    >
                        <FaMoneyBillWave className="text-2xl text-yellow-600 mb-2" />
                        <span className="font-medium text-gray-900">Create Invoice</span>
                    </Link>

                    <Link
                        to="/receptionist/room-management?action=assign"
                        className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                        <FaBed className="text-2xl text-purple-600 mb-2" />
                        <span className="font-medium text-gray-900">Assign Room</span>
                    </Link>
                </div>
            </div>

            {/* Notifications */}
            <div className="mt-8">
                <div className="flex items-center mb-4">
                    <FaExclamationTriangle className="text-yellow-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="space-y-2">
                        <div className="flex items-center text-sm">
                            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                            <span className="text-gray-700">
                                <span className="font-medium">Emergency case</span> in Room 301 - Robert Brown needs immediate attention
                            </span>
                        </div>
                        <div className="flex items-center text-sm">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                            <span className="text-gray-700">
                                <span className="font-medium">3 appointments</span> are running late today
                            </span>
                        </div>
                        <div className="flex items-center text-sm">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                            <span className="text-gray-700">
                                <span className="font-medium">Room 302</span> is under maintenance until 5 PM
                            </span>
                        </div>
                    </div>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                </div>
            </div>
        </div>
    );
};

<<<<<<< HEAD
export default AppointmentList;
=======
export default DashboardHome;
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
