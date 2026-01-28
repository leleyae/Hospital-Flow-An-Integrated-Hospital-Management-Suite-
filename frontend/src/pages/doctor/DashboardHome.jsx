import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FaCalendarAlt,
    FaUserInjured,
    FaStethoscope,
    FaClock,
    FaCalendarCheck,
    FaSearch,
    FaFilter,
    FaArrowRight
} from 'react-icons/fa';
import doctorService from '../../services/doctorService';

const DoctorAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('');

    // Status options
    const statusOptions = [
        { value: 'all', label: 'All Appointments' },
        { value: 'scheduled', label: 'Scheduled' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
    ];

    useEffect(() => {
        loadAppointments();
    }, []);

    useEffect(() => {
        filterAppointments();
    }, [searchTerm, statusFilter, dateFilter, appointments]);

    const loadAppointments = async () => {
        try {
            setLoading(true);
            const data = await doctorService.getAppointments();
            setAppointments(data.appointments);
        } catch (error) {
            console.error('Error loading appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterAppointments = () => {
        let filtered = [...appointments];

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(app => app.appointmentStatus === statusFilter);
        }

        // Filter by date
        if (dateFilter) {
            const filterDate = new Date(dateFilter);
            filtered = filtered.filter(app => {
                const appDate = new Date(app.appointmentDate);
                return appDate.toDateString() === filterDate.toDateString();
            });
        }

        // Filter by search term
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(app => {
                return (
                    (app.patientName && app.patientName.toLowerCase().includes(term)) ||
                    (app.patientId && app.patientId.toString().includes(term)) ||
                    (app.reason && app.reason.toLowerCase().includes(term))
                );
            });
        }

        // Sort by date and time
        filtered.sort((a, b) => {
            const dateA = new Date(`${a.appointmentDate}T${a.startTime}`);
            const dateB = new Date(`${b.appointmentDate}T${b.startTime}`);
            return dateA - dateB;
        });

        setFilteredAppointments(filtered);
    };

    const getStatusBadge = (status) => {
        const badges = {
            'scheduled': 'bg-blue-100 text-blue-800',
            'in_progress': 'bg-yellow-100 text-yellow-800',
            'completed': 'bg-green-100 text-green-800',
            'cancelled': 'bg-red-100 text-red-800'
        };

        const label = status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');

        return (
<<<<<<< HEAD
            <span className={`px-3 py-1 rounded-full text-lg font-medium ${badges[status] || 'bg-gray-100 text-gray-800'}`}>
=======
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${badges[status] || 'bg-gray-100 text-gray-800'}`}>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                {label}
            </span>
        );
    };

    const formatTime = (time) => {
        if (!time) return '';
        return time.substring(0, 5); // Show HH:MM format
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getTodayAppointments = () => {
        const today = new Date().toDateString();
        return appointments.filter(app =>
            new Date(app.appointmentDate).toDateString() === today
        );
    };

    const getUpcomingAppointments = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return appointments.filter(app =>
            new Date(app.appointmentDate) >= today &&
            app.appointmentStatus === 'scheduled'
        );
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
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
                <p className="text-gray-600">Manage and view all patient appointments</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500">Total Appointments</p>
                            <h3 className="text-2xl font-bold">{appointments.length}</h3>
                        </div>
                        <FaCalendarAlt className="text-blue-500 text-3xl" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500">Today's Appointments</p>
                            <h3 className="text-2xl font-bold">{getTodayAppointments().length}</h3>
                        </div>
                        <FaCalendarCheck className="text-green-500 text-3xl" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500">Upcoming</p>
                            <h3 className="text-2xl font-bold">{getUpcomingAppointments().length}</h3>
                        </div>
                        <FaClock className="text-yellow-500 text-3xl" />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="md:col-span-2">
<<<<<<< HEAD
                        <label className="block text-lg font-medium text-gray-700 mb-1">
=======
                        <label className="block text-sm font-medium text-gray-700 mb-1">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                            Search Patients
                        </label>
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by patient name, ID, or reason..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Date Filter */}
                    <div>
<<<<<<< HEAD
                        <label className="block text-lg font-medium text-gray-700 mb-1">
=======
                        <label className="block text-sm font-medium text-gray-700 mb-1">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                            Date Filter
                        </label>
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Status Filter */}
                    <div>
<<<<<<< HEAD
                        <label className="block text-lg font-medium text-gray-700 mb-1">
=======
                        <label className="block text-sm font-medium text-gray-700 mb-1">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                            Status Filter
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {statusOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Filter Actions */}
                <div className="flex justify-end mt-4 space-x-3">
                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setStatusFilter('all');
                            setDateFilter('');
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                        Clear Filters
                    </button>
                    <button
                        onClick={filterAppointments}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>

            {/* Appointments Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold flex items-center">
                        <FaCalendarAlt className="mr-2 text-blue-500" />
                        Appointments ({filteredAppointments.length})
                    </h2>
                </div>

                {filteredAppointments.length === 0 ? (
                    <div className="text-center py-12">
                        <FaCalendarAlt className="mx-auto text-gray-400 text-4xl mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                        <p className="text-gray-500">Try adjusting your filters or check back later</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
<<<<<<< HEAD
                                    <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                                        Patient
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
                                        Patient
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
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <FaUserInjured className="text-blue-600" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="font-medium text-gray-900">
<<<<<<< HEAD
                                                        {appointment.patientId.userId.firstName} {appointment.patientId.userId.lastName}
                                                    </div>
                                                    <div className="text-lg text-gray-500">
=======
                                                        {appointment.patientName || 'Patient'}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                        ID: {appointment.patientId?.patientId || 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
<<<<<<< HEAD
                                            <div className="text-lg text-gray-900">
                                                {formatDate(appointment.appointmentDate)}
                                            </div>

                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-lg text-gray-900 max-w-xs truncate">
                                                {appointment.reason || 'No reason provided'}
                                            </div>
                                            {appointment.symptoms && appointment.symptoms.length > 0 && (
                                                <div className="text-lg text-gray-500 mt-1">
=======
                                            <div className="text-sm text-gray-900">
                                                {formatDate(appointment.appointmentDate)}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                <FaClock className="inline mr-1" />
                                                {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 max-w-xs truncate">
                                                {appointment.reason || 'No reason provided'}
                                            </div>
                                            {appointment.symptoms && appointment.symptoms.length > 0 && (
                                                <div className="text-xs text-gray-500 mt-1">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                    Symptoms: {appointment.symptoms.join(', ')}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(appointment.appointmentStatus)}
                                        </td>
<<<<<<< HEAD
                                        <td className="px-6 py-4 whitespace-nowrap text-lg font-medium">
=======
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                            <div className="flex space-x-2">
                                                {appointment.appointmentStatus === 'scheduled' && (
                                                    <button
                                                        onClick={() => {
                                                            // Update status to in_progress
                                                            doctorService.updateAppointmentStatus(appointment._id, 'in_progress')
                                                                .then(() => {
                                                                    loadAppointments();
                                                                });
                                                        }}
<<<<<<< HEAD
                                                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-lg"
=======
                                                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                    >
                                                        Start
                                                    </button>
                                                )}

                                                {appointment.appointmentStatus === 'in_progress' && (
                                                    <Link
                                                        to={`/doctor/consultation/${appointment._id}`}
<<<<<<< HEAD
                                                        className="flex items-center px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-lg"
=======
                                                        className="flex items-center px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                    >
                                                        <FaStethoscope className="mr-1" />
                                                        Continue
                                                    </Link>
                                                )}



                                                <Link
                                                    to={`/doctor/appointments/${appointment._id}`}
<<<<<<< HEAD
                                                    className="flex items-center px-3 py-1 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 text-lg"
=======
                                                    className="flex items-center px-3 py-1 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 text-sm"
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                >
                                                    Details
                                                    <FaArrowRight className="ml-1" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Status Legend */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Status Legend</h3>
                <div className="flex flex-wrap gap-3">
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
<<<<<<< HEAD
                        <span className="text-lg text-gray-600">Scheduled</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                        <span className="text-lg text-gray-600">In Progress</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-lg text-gray-600">Completed</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                        <span className="text-lg text-gray-600">Cancelled</span>
=======
                        <span className="text-sm text-gray-600">Scheduled</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-600">In Progress</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-600">Completed</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-600">Cancelled</span>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorAppointments;