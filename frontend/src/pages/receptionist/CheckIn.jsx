// src/pages/receptionist/CheckIn.jsx
import { useState, useEffect } from 'react';
import {
    FaSearch,
    FaCheckCircle,
    FaClock,
    FaUserMd,
    FaCalendarAlt,
    FaUserInjured,
    FaHospital,
    FaStethoscope,
    FaTimes,
} from 'react-icons/fa';
import receptionistService from '../../services/receptionist.service';


const CheckIn = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('scheduled');
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);

    const [newAppointment, setNewAppointment] = useState({
        patientId: '',
        doctorId: '',
        appointmentDate: '',
        time: '',
        type: 'consultation',
        reason: '',
        priority: 'medium'
    });

    useEffect(() => {
        loadAppointments();
        loadDoctors();
        loadPatients();
    }, [statusFilter]);

    const loadAppointments = async () => {
        try {
            setLoading(true);
            const data = await receptionistService.getAppointments({
                status: statusFilter,
                search
            });
            setAppointments(data.data.appointments);
        } catch (error) {
            console.error('Error loading appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadDoctors = async () => {
        try {
            const data = await receptionistService.getDoctors();
            setDoctors(data.data.doctors);
        } catch (error) {
            console.error('Error loading doctors:', error);
        }
    };

    const loadPatients = async () => {
        try {
            const data = await receptionistService.getPatients();
            setPatients(data.data.patients);
        } catch (error) {
            console.error('Error loading patients:', error);
        }
    };

    const handleCheckIn = async (appointmentId) => {
        try {
            await receptionistService.checkInPatient(
                appointments.find(a => a.id === appointmentId)?.patientId,
                appointmentId
            );
            loadAppointments();
            alert('Patient checked in successfully!');
        } catch (error) {
            console.error('Error checking in patient:', error);
            alert('Failed to check in patient');
        }
    };

    const handleCreateAppointment = async () => {
        try {
            const patient = patients.find(p => p.id === newAppointment.patientId);
            const doctor = doctors.find(d => d.id === newAppointment.doctorId);

            const appointmentData = {
                patientId: newAppointment.patientId,
                patientName: patient ? `${patient.firstName} ${patient.lastName}` : '',
                doctorId: newAppointment.doctorId,
                doctorName: doctor ? doctor.name : '',
                department: doctor ? doctor.department : '',
                appointmentDate: newAppointment.appointmentDate,
                time: newAppointment.time,
                type: newAppointment.type,
                reason: newAppointment.reason,
                priority: newAppointment.priority
            };

            await receptionistService.createAppointment(appointmentData);
            setShowAppointmentModal(false);
            resetNewAppointment();
            loadAppointments();
            alert('Appointment scheduled successfully!');
        } catch (error) {
            console.error('Error creating appointment:', error);
            alert('Failed to create appointment');
        }
    };

    const handleUpdateAppointmentStatus = async (appointmentId, status) => {
        try {
            await receptionistService.updateAppointmentStatus(appointmentId, status);
            loadAppointments();
            alert(`Appointment ${status} successfully`);
        } catch (error) {
            console.error('Error updating appointment:', error);
            alert('Failed to update appointment');
        }
    };

    const resetNewAppointment = () => {
        setNewAppointment({
            patientId: '',
            doctorId: '',
            appointmentDate: '',
            time: '',
            type: 'consultation',
            reason: '',
            priority: 'medium'
        });
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'scheduled': { color: 'bg-blue-100 text-blue-800', icon: '📅' },
            'confirmed': { color: 'bg-green-100 text-green-800', icon: '✓' },
            'checked-in': { color: 'bg-purple-100 text-purple-800', icon: '👤' },
            'in-progress': { color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
            'completed': { color: 'bg-gray-100 text-gray-800', icon: '✅' },
            'cancelled': { color: 'bg-red-100 text-red-800', icon: '✗' },
            'pending': { color: 'bg-gray-100 text-gray-800', icon: '⏳' }
        };

        const config = statusConfig[status] || statusConfig.pending;
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                {config.icon} {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const getPriorityBadge = (priority) => {
        const priorityConfig = {
            'high': { color: 'bg-red-100 text-red-800', text: 'High' },
            'medium': { color: 'bg-yellow-100 text-yellow-800', text: 'Medium' },
            'low': { color: 'bg-green-100 text-green-800', text: 'Low' },
            'emergency': { color: 'bg-red-100 text-red-800', text: 'Emergency' }
        };

        const config = priorityConfig[priority] || priorityConfig.medium;
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                {config.text}
            </span>
        );
    };

    const getTypeBadge = (type) => {
        const typeConfig = {
            'consultation': { color: 'bg-blue-100 text-blue-800', text: 'Consultation' },
            'follow-up': { color: 'bg-green-100 text-green-800', text: 'Follow-up' },
            'emergency': { color: 'bg-red-100 text-red-800', text: 'Emergency' },
            'checkup': { color: 'bg-purple-100 text-purple-800', text: 'Checkup' },
            'telemedicine': { color: 'bg-teal-100 text-teal-800', text: 'Telemedicine' }
        };

        const config = typeConfig[type] || typeConfig.consultation;
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                {config.text}
            </span>
        );
    };

    const timeSlots = [
        '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM',
        '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
        '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
        '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
        '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM'
    ];

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Patient Check-in</h1>
                    <p className="text-gray-600">Manage appointments and patient check-ins</p>
                </div>
                <button
                    onClick={() => setShowAppointmentModal(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <FaCalendarAlt className="mr-2" />
                    Schedule Appointment
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <FaCalendarAlt className="text-2xl text-blue-500 mr-3" />
                        <div>
                            <p className="text-sm text-gray-500">Todays Appointments</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {appointments.length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <FaCheckCircle className="text-2xl text-green-500 mr-3" />
                        <div>
                            <p className="text-sm text-gray-500">Checked In</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {appointments.filter(a => a.status === 'checked-in').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <FaClock className="text-2xl text-yellow-500 mr-3" />
                        <div>
                            <p className="text-sm text-gray-500">Scheduled</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {appointments.filter(a => a.status === 'scheduled').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <FaStethoscope className="text-2xl text-purple-500 mr-3" />
                        <div>
                            <p className="text-sm text-gray-500">In Progress</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {appointments.filter(a => a.status === 'in-progress').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by patient, doctor, or ID..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && loadAppointments()}
                                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <div className="flex flex-wrap gap-2">
                            {['scheduled', 'confirmed', 'checked-in', 'in-progress', 'completed', 'cancelled'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-3 py-1 rounded-lg text-sm ${statusFilter === status ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Actions</label>
                        <button
                            onClick={loadAppointments}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            {/* Appointments List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : appointments.length === 0 ? (
                    <div className="text-center py-12">
                        <FaCalendarAlt className="mx-auto text-gray-400 text-4xl mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                        <p className="text-gray-500">Schedule an appointment to get started</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Appointment
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Patient
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Doctor & Department
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date & Time
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type & Priority
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
                                {appointments.map((appointment) => (
                                    <tr key={appointment.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">#{appointment.appointmentId}</div>
                                            <div className="text-sm text-gray-500">{appointment.reason}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                                                    <FaUserInjured className="text-blue-600" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{appointment.patientName}</div>
                                                    <div className="text-xs text-gray-500">ID: {appointment.patientId}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                                                    <FaUserMd className="text-green-600" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{appointment.doctorName}</div>
                                                    <div className="text-xs text-gray-500">{appointment.department}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <FaCalendarAlt className="text-gray-400 mr-2" />
                                                <div>
                                                    <div className="text-sm text-gray-900">{appointment.appointmentDate}</div>
                                                    <div className="text-xs text-gray-500">{appointment.time}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="space-y-1">
                                                {getTypeBadge(appointment.type)}
                                                {getPriorityBadge(appointment.priority)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(appointment.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                {(appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
                                                    <button
                                                        onClick={() => handleCheckIn(appointment.id)}
                                                        className="flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs"
                                                    >
                                                        <FaCheckCircle className="mr-1" />
                                                        Check-in
                                                    </button>
                                                )}

                                                {appointment.status === 'checked-in' && (
                                                    <button
                                                        onClick={() => handleUpdateAppointmentStatus(appointment.id, 'in-progress')}
                                                        className="flex items-center px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-xs"
                                                    >
                                                        <FaClock className="mr-1" />
                                                        Start
                                                    </button>
                                                )}

                                                {appointment.status === 'in-progress' && (
                                                    <button
                                                        onClick={() => handleUpdateAppointmentStatus(appointment.id, 'completed')}
                                                        className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs"
                                                    >
                                                        <FaCheckCircle className="mr-1" />
                                                        Complete
                                                    </button>
                                                )}

                                                {(appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
                                                    <button
                                                        onClick={() => handleUpdateAppointmentStatus(appointment.id, 'cancelled')}
                                                        className="flex items-center px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs"
                                                    >
                                                        <FaTimes className="mr-1" />
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* New Appointment Modal */}
            {showAppointmentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Schedule Appointment</h3>
                                <button
                                    onClick={() => setShowAppointmentModal(false)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Patient Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Select Patient *
                                    </label>
                                    <select
                                        value={newAppointment.patientId}
                                        onChange={(e) => setNewAppointment({ ...newAppointment, patientId: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Select a patient...</option>
                                        {patients.map(patient => (
                                            <option key={patient.id} value={patient.id}>
                                                {patient.firstName} {patient.lastName} - {patient.patientId}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Doctor Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Select Doctor *
                                    </label>
                                    <select
                                        value={newAppointment.doctorId}
                                        onChange={(e) => setNewAppointment({ ...newAppointment, doctorId: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Select a doctor...</option>
                                        {doctors.map(doctor => (
                                            <option key={doctor.id} value={doctor.id}>
                                                {doctor.name} - {doctor.department}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Date and Time */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Appointment Date *
                                        </label>
                                        <input
                                            type="date"
                                            value={newAppointment.appointmentDate}
                                            onChange={(e) => setNewAppointment({ ...newAppointment, appointmentDate: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Time Slot *
                                        </label>
                                        <select
                                            value={newAppointment.time}
                                            onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="">Select time...</option>
                                            {timeSlots.map(time => (
                                                <option key={time} value={time}>{time}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Type and Priority */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Appointment Type *
                                        </label>
                                        <select
                                            value={newAppointment.type}
                                            onChange={(e) => setNewAppointment({ ...newAppointment, type: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="consultation">Consultation</option>
                                            <option value="follow-up">Follow-up</option>
                                            <option value="checkup">Checkup</option>
                                            <option value="telemedicine">Telemedicine</option>
                                            <option value="emergency">Emergency</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Priority *
                                        </label>
                                        <select
                                            value={newAppointment.priority}
                                            onChange={(e) => setNewAppointment({ ...newAppointment, priority: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                            <option value="emergency">Emergency</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Reason */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Reason for Visit *
                                    </label>
                                    <textarea
                                        value={newAppointment.reason}
                                        onChange={(e) => setNewAppointment({ ...newAppointment, reason: e.target.value })}
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Briefly describe the reason for the appointment..."
                                        required
                                    />
                                </div>

                                {/* Availability Notice */}
                                <div className="bg-blue-50 border border-blue-200 rounded p-4">
                                    <div className="flex">
                                        <FaHospital className="text-blue-500 mr-3 flex-shrink-0" />
                                        <div>
                                            <h4 className="text-sm font-medium text-blue-800">Appointment Scheduling</h4>
                                            <p className="text-sm text-blue-700 mt-1">
                                                Standard appointment duration is 30 minutes. Emergency cases will be prioritized.
                                                Please verify doctor availability before confirming.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setShowAppointmentModal(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateAppointment}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Schedule Appointment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckIn;