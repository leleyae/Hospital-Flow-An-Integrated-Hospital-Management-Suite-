// src/pages/doctor/Appointments.jsx
import { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    User,
    Phone,
    Video,
    CheckCircle,
    XCircle,
    MoreVertical,
    Filter,
    RefreshCw
} from 'lucide-react';
import doctorService from '../../services/doctorService';


const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedDate, setSelectedDate] = useState('');
    const [showTodayOnly, setShowTodayOnly] = useState(false);

    const statuses = [
        { id: 'all', label: 'All Appointments', color: 'gray' },
        { id: 'scheduled', label: 'Scheduled', color: 'blue' },
        { id: 'confirmed', label: 'Confirmed', color: 'green' },
        { id: 'in-progress', label: 'In Progress', color: 'yellow' },
        { id: 'completed', label: 'Completed', color: 'purple' },
        { id: 'cancelled', label: 'Cancelled', color: 'red' },
    ];

    useEffect(() => {
        fetchAppointments();
    }, [selectedStatus, selectedDate, showTodayOnly]);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const params = {};

            if (selectedStatus !== 'all') {
                params.status = selectedStatus;
            }

            if (selectedDate) {
                params.date = selectedDate;
            }

            if (showTodayOnly) {
                const today = new Date().toISOString().split('T')[0];
                params.date = today;
            }

            const response = selectedDate || showTodayOnly
                ? await doctorService.getAppointments(params)
                : await doctorService.getTodayAppointments();

            setAppointments(response.data.appointments || []);
        } catch (error) {
            console.error('Failed to fetch appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (appointmentId, newStatus) => {
        try {
            await doctorService.updateAppointmentStatus(appointmentId, newStatus);
            fetchAppointments(); // Refresh the list
        } catch (error) {
            console.error('Failed to update appointment status:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'scheduled': return 'bg-blue-100 text-blue-800';
            case 'confirmed': return 'bg-green-100 text-green-800';
            case 'in-progress': return 'bg-yellow-100 text-yellow-800';
            case 'completed': return 'bg-purple-100 text-purple-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minutes} ${ampm}`;
    };

    if (loading && appointments.length === 0) {
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
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
                        <p className="text-gray-600 mt-2">Manage and track your appointments</p>
                    </div>
                    <button
                        onClick={fetchAppointments}
                        className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <Filter className="w-5 h-5 text-gray-400 mr-2" />
<<<<<<< HEAD
                            <span className="text-lg font-medium text-gray-700">Filter by:</span>
=======
                            <span className="text-sm font-medium text-gray-700">Filter by:</span>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {statuses.map(status => (
                                <button
                                    key={status.id}
                                    onClick={() => setSelectedStatus(status.id)}
<<<<<<< HEAD
                                    className={`px-3 py-1.5 rounded-full text-lg font-medium transition-colors duration-200 ${selectedStatus === status.id
=======
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${selectedStatus === status.id
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {status.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showTodayOnly}
                                onChange={(e) => {
                                    setShowTodayOnly(e.target.checked);
                                    if (e.target.checked) {
                                        setSelectedDate('');
                                    }
                                }}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
<<<<<<< HEAD
                            <span className="text-lg text-gray-700">Today Only</span>
=======
                            <span className="text-sm text-gray-700">Today Only</span>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                        </label>

                        {(selectedDate || showTodayOnly) && (
                            <button
                                onClick={() => {
                                    setSelectedDate('');
                                    setShowTodayOnly(false);
                                }}
<<<<<<< HEAD
                                className="text-lg text-gray-600 hover:text-gray-900"
=======
                                className="text-sm text-gray-600 hover:text-gray-900"
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                            >
                                Clear Date
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Appointments List */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Calendar className="w-6 h-6 text-blue-600 mr-3" />
                            <h2 className="text-xl font-bold text-gray-900">
                                {showTodayOnly ? "Today's Appointments" : "All Appointments"}
<<<<<<< HEAD
                                <span className="ml-2 text-lg font-normal text-gray-500">
=======
                                <span className="ml-2 text-sm font-normal text-gray-500">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                    ({appointments.length} found)
                                </span>
                            </h2>
                        </div>
                    </div>
                </div>

                {appointments.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                        {appointments.map((appointment) => (
                            <div key={appointment._id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                                    {/* Patient Info */}
                                    <div className="flex items-start space-x-4 mb-4 lg:mb-0">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <User className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">
                                                {appointment.patientId?.userId?.firstName} {appointment.patientId?.userId?.lastName}
                                            </h3>
                                            <div className="flex items-center mt-1 space-x-4">
<<<<<<< HEAD
                                                <span className="flex items-center text-lg text-gray-500">
                                                    <Phone className="w-3 h-3 mr-1" />
                                                    {appointment.patientId?.userId?.phoneNumber || 'N/A'}
                                                </span>
                                                <span className="text-lg text-gray-500">
=======
                                                <span className="flex items-center text-sm text-gray-500">
                                                    <Phone className="w-3 h-3 mr-1" />
                                                    {appointment.patientId?.userId?.phoneNumber || 'N/A'}
                                                </span>
                                                <span className="text-sm text-gray-500">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                    ID: {appointment.patientId?.patientId}
                                                </span>
                                            </div>
                                            <div className="mt-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                                                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Appointment Details */}
                                    <div className="flex flex-col space-y-2">
                                        <div className="flex items-center text-gray-600">
                                            <Calendar className="w-4 h-4 mr-2" />
<<<<<<< HEAD
                                            <span className="text-lg">
=======
                                            <span className="text-sm">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <Clock className="w-4 h-4 mr-2" />
<<<<<<< HEAD
                                            <span className="text-lg font-medium">
                                                {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                                            </span>
                                        </div>
                                        <div className="text-lg text-gray-500">
=======
                                            <span className="text-sm font-medium">
                                                {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-500">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                            Type: <span className="font-medium capitalize">{appointment.appointmentType}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col space-y-3 mt-4 lg:mt-0">
                                        <div className="flex space-x-2">
                                            {appointment.appointmentType === 'telemedicine' && (
                                                <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200 flex items-center">
                                                    <Video className="w-4 h-4 mr-2" />
                                                    Start Call
                                                </button>
                                            )}

                                            {appointment.status === 'scheduled' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(appointment._id, 'confirmed')}
                                                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200 flex items-center"
                                                >
                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                    Confirm
                                                </button>
                                            )}

                                            {appointment.status === 'confirmed' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(appointment._id, 'in-progress')}
                                                    className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors duration-200 flex items-center"
                                                >
                                                    Start Consultation
                                                </button>
                                            )}

                                            {appointment.status === 'in-progress' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(appointment._id, 'completed')}
                                                    className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors duration-200 flex items-center"
                                                >
                                                    Complete
                                                </button>
                                            )}

                                            {['scheduled', 'confirmed'].includes(appointment.status) && (
                                                <button
                                                    onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
                                                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 flex items-center"
                                                >
                                                    <XCircle className="w-4 h-4 mr-2" />
                                                    Cancel
                                                </button>
                                            )}
                                        </div>

                                        <button className="text-gray-400 hover:text-gray-600 self-end lg:self-start">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Additional Info */}
                                {appointment.reason && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
<<<<<<< HEAD
                                        <p className="text-lg text-gray-600">
=======
                                        <p className="text-sm text-gray-600">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                            <span className="font-medium">Reason:</span> {appointment.reason}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                        <p className="text-gray-500">
                            {selectedStatus !== 'all' || selectedDate || showTodayOnly
                                ? 'Try adjusting your filters'
                                : 'You have no appointments scheduled'}
                        </p>
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
<<<<<<< HEAD
                    <p className="text-lg text-blue-600 font-medium">Total</p>
=======
                    <p className="text-sm text-blue-600 font-medium">Total</p>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                    <p className="text-2xl font-bold text-blue-900">{appointments.length}</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
<<<<<<< HEAD
                    <p className="text-lg text-green-600 font-medium">Confirmed</p>
=======
                    <p className="text-sm text-green-600 font-medium">Confirmed</p>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                    <p className="text-2xl font-bold text-green-900">
                        {appointments.filter(a => a.status === 'confirmed').length}
                    </p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
<<<<<<< HEAD
                    <p className="text-lg text-yellow-600 font-medium">In Progress</p>
=======
                    <p className="text-sm text-yellow-600 font-medium">In Progress</p>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                    <p className="text-2xl font-bold text-yellow-900">
                        {appointments.filter(a => a.status === 'in-progress').length}
                    </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
<<<<<<< HEAD
                    <p className="text-lg text-purple-600 font-medium">Completed</p>
=======
                    <p className="text-sm text-purple-600 font-medium">Completed</p>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                    <p className="text-2xl font-bold text-purple-900">
                        {appointments.filter(a => a.status === 'completed').length}
                    </p>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
<<<<<<< HEAD
                    <p className="text-lg text-red-600 font-medium">Cancelled</p>
=======
                    <p className="text-sm text-red-600 font-medium">Cancelled</p>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                    <p className="text-2xl font-bold text-red-900">
                        {appointments.filter(a => a.status === 'cancelled').length}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Appointments;