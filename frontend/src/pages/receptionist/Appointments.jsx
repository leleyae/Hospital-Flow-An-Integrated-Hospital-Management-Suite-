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
        } finally {
            setLoading(false);
        }
    };

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
<<<<<<< HEAD
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-lg font-medium ${config.color}`}>
=======
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                {config.text}
            </span>
        );
    };

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
<<<<<<< HEAD
                                <p className="text-lg text-gray-500">Total Appointments</p>
=======
                                <p className="text-sm text-gray-500">Total Appointments</p>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
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
<<<<<<< HEAD
                                <p className="text-lg text-gray-500">Today's Appointments</p>
=======
                                <p className="text-sm text-gray-500">Today's Appointments</p>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
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
<<<<<<< HEAD
                                <p className="text-lg text-gray-500">Upcoming</p>
=======
                                <p className="text-sm text-gray-500">Upcoming</p>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
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
<<<<<<< HEAD
                                <p className="text-lg text-gray-500">Doctors on Duty</p>
=======
                                <p className="text-sm text-gray-500">Doctors on Duty</p>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
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
<<<<<<< HEAD
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
=======
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Appointment ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Patient
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Doctor
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date & Time
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Reason
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredAppointments.map((appointment) => (
                                        <tr key={appointment._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
<<<<<<< HEAD
                                                <div className="text-lg font-mono text-blue-600">
=======
                                                <div className="text-sm font-mono text-blue-600">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                    {appointment.appointmentId}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <FaUser className="text-blue-600" />
                                                    </div>
                                                    <div className="ml-4">
<<<<<<< HEAD
                                                        <div className="text-lg font-medium text-gray-900">
                                                            {appointment.patientId?.userId?.firstName} {appointment.patientId?.userId?.lastName}
                                                        </div>
                                                        <div className="text-lg text-gray-500">
=======
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {appointment.patientId?.userId?.firstName} {appointment.patientId?.userId?.lastName}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                            {appointment.patientId?.patientId}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
<<<<<<< HEAD
                                                <div className="text-lg text-gray-900">
                                                    Dr. {appointment.doctorId?.firstName} {appointment.doctorId?.lastName}
                                                </div>
                                                <div className="text-lg text-gray-500">
=======
                                                <div className="text-sm text-gray-900">
                                                    Dr. {appointment.doctorId?.firstName} {appointment.doctorId?.lastName}
                                                </div>
                                                <div className="text-sm text-gray-500">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                    {appointment.doctorId?.specialization || 'General'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
<<<<<<< HEAD
                                                <div className="text-lg text-gray-900">
=======
                                                <div className="text-sm text-gray-900">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
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
<<<<<<< HEAD
                                                <div className="text-lg text-gray-900 max-w-xs truncate">
                                                    {appointment.reason}
                                                </div>
                                                <div className="text-lg text-gray-500 mt-1">
=======
                                                <div className="text-sm text-gray-900 max-w-xs truncate">
                                                    {appointment.reason}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                    {appointment.type}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(appointment.status)}
                                            </td>
<<<<<<< HEAD
                                            <td className="px-6 py-4 whitespace-nowrap text-lg font-medium">
=======
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
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
<<<<<<< HEAD
                <div className="mt-6 text-center text-gray-500 text-lg">
=======
                <div className="mt-6 text-center text-gray-500 text-sm">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                    Showing {filteredAppointments.length} of {appointments.length} appointments
                </div>
            </div>
        </div>
    );
};

export default AppointmentList;