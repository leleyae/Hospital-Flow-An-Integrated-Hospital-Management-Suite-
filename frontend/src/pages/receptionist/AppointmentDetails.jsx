import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
    FaCalendarAlt,
    FaUserMd,
    FaUser,
    FaClock,
    FaPhone,
    FaEnvelope,
    FaArrowLeft,
    FaEdit,
    FaPrint,
    FaStethoscope,
    FaNotesMedical
} from 'react-icons/fa';
import { FiCalendar, FiClock, FiDollarSign } from 'react-icons/fi';
import { MdLocationOn } from 'react-icons/md';
import receptionistService from '../../services/receptionist.service';

const AppointmentDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    // State
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Fetch appointment details
    useEffect(() => {
        fetchAppointmentDetails();
    }, [id]);

    const fetchAppointmentDetails = async () => {
        try {
            setLoading(true);
            const response = await receptionistService.getAppointmentById(id);
            setAppointment(response.data.data);
        } catch (error) {
            console.error('Error fetching appointment:', error);
            alert('Failed to load appointment details');
            navigate('/receptionist/appointments');
        } finally {
            setLoading(false);
        }
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Format time
    const formatTime = (time) => {
        return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    // Get status badge
    const StatusBadge = ({ status }) => {
        const statusConfig = {
            scheduled: { color: 'bg-blue-100 text-blue-800', text: 'Scheduled' },
            confirmed: { color: 'bg-green-100 text-green-800', text: 'Confirmed' },
            completed: { color: 'bg-gray-100 text-gray-800', text: 'Completed' },
            cancelled: { color: 'bg-red-100 text-red-800', text: 'Cancelled' },
            noShow: { color: 'bg-orange-100 text-orange-800', text: 'No Show' }
        };

        const config = statusConfig[status] || statusConfig.scheduled;

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
                {config.text}
            </span>
        );
    };

    // Handle status update
    const updateStatus = async (newStatus) => {
        try {
            await receptionistService.updateAppointmentStatus(id, { status: newStatus });
            setAppointment({ ...appointment, status: newStatus });
            alert(`Appointment marked as ${newStatus}`);
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    // Handle delete
    const handleDelete = async () => {
        try {
            await receptionistService.deleteAppointment(id);
            alert('Appointment deleted successfully');
            navigate('/receptionist/appointments');
        } catch (error) {
            console.error('Error deleting appointment:', error);
            alert('Failed to delete appointment');
        }
    };

    // Print appointment
    const printAppointment = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Appointment Details - ${appointment?.appointmentId}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 40px; }
                        .header { text-align: center; margin-bottom: 30px; }
                        .header h1 { color: #333; margin-bottom: 10px; }
                        .header .date { color: #666; }
                        .section { margin-bottom: 25px; }
                        .section h2 { color: #444; border-bottom: 2px solid #eee; padding-bottom: 5px; }
                        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
                        .info-item { margin-bottom: 10px; }
                        .info-label { font-weight: bold; color: #555; }
                        .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Appointment Details</h1>
                        <div class="date">Generated: ${new Date().toLocaleString()}</div>
                    </div>
                    
                    <div class="section">
                        <h2>Appointment Information</h2>
                        <div class="info-grid">
                            <div class="info-item">
                                <div class="info-label">Appointment ID:</div>
                                <div>${appointment?.appointmentId}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Date:</div>
                                <div>${formatDate(appointment?.appointmentDate)}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Time:</div>
                                <div>${formatTime(appointment?.appointmentTime)}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Status:</div>
                                <div>${appointment?.status}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Type:</div>
                                <div>${appointment?.type}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Reason:</div>
                                <div>${appointment?.reason}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="section">
                        <h2>Patient Information</h2>
                        <div class="info-grid">
                            <div class="info-item">
                                <div class="info-label">Patient Name:</div>
                                <div>${appointment?.patientId?.userId?.firstName} ${appointment?.patientId?.userId?.lastName}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Patient ID:</div>
                                <div>${appointment?.patientId?.patientId}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Phone:</div>
                                <div>${appointment?.patientId?.userId?.phoneNumber || 'N/A'}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Email:</div>
                                <div>${appointment?.patientId?.userId?.email || 'N/A'}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="section">
                        <h2>Doctor Information</h2>
                        <div class="info-grid">
                            <div class="info-item">
                                <div class="info-label">Doctor:</div>
                                <div>Dr. ${appointment?.doctorId?.firstName} ${appointment?.doctorId?.lastName}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Specialization:</div>
                                <div>${appointment?.doctorId?.specialization || 'General'}</div>
                            </div>
                        </div>
                    </div>
                    
                    ${appointment?.notes ? `
                    <div class="section">
                        <h2>Additional Notes</h2>
                        <div>${appointment.notes}</div>
                    </div>
                    ` : ''}
                    
                    <div class="footer">
                        Clinic Management System | ${window.location.origin}
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!appointment) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Appointment not found</p>
                    <button
                        onClick={() => navigate('/receptionist/appointments')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Back to Appointments
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        to="/receptionist/appointments"
                        className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
                    >
                        <FaArrowLeft className="mr-2" />
                        Back to Appointments
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Appointment Details</h1>
                            <div className="flex items-center space-x-3">
                                <p className="text-lg text-blue-600 font-mono">{appointment.appointmentId}</p>
                                <StatusBadge status={appointment.status} />
                            </div>
                        </div>

                        <div className="flex space-x-3 mt-4 md:mt-0">
                            <button
                                onClick={printAppointment}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
                            >
                                <FaPrint className="mr-2" />
                                Print
                            </button>
                            <button
                                onClick={() => navigate(`/receptionist/appointments/${id}/edit`)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                            >
                                <FaEdit className="mr-2" />
                                Edit Appointment
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Appointment Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Appointment Card */}
                        <div className="bg-white rounded-xl shadow p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <FaCalendarAlt className="mr-2 text-blue-500" />
                                Appointment Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Date</label>
                                        <div className="mt-1 flex items-center text-gray-900">
                                            <FiCalendar className="mr-2 text-gray-400" />
                                            {formatDate(appointment.appointmentDate)}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Time</label>
                                        <div className="mt-1 flex items-center text-gray-900">
                                            <FiClock className="mr-2 text-gray-400" />
                                            {formatTime(appointment.appointmentTime)}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Type</label>
                                        <div className="mt-1 text-gray-900 capitalize">
                                            {appointment.type}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Duration</label>
                                        <div className="mt-1 text-gray-900">
                                            30 minutes (standard)
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Created On</label>
                                        <div className="mt-1 text-gray-900">
                                            {new Date(appointment.createdAt).toLocaleString()}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Updated On</label>
                                        <div className="mt-1 text-gray-900">
                                            {new Date(appointment.updatedAt).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Reason */}
                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-500 mb-2">Reason for Visit</label>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-gray-900">{appointment.reason}</p>
                                </div>
                            </div>

                            {/* Notes */}
                            {appointment.notes && (
                                <div className="mt-6">
                                    <label className="block text-sm font-medium text-gray-500 mb-2">Additional Notes</label>
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <p className="text-gray-900">{appointment.notes}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Patient Card */}
                        <div className="bg-white rounded-xl shadow p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <FaUser className="mr-2 text-green-500" />
                                Patient Information
                            </h2>

                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                                        <FaUser className="h-8 w-8 text-green-600" />
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {appointment.patientId?.userId?.firstName} {appointment.patientId?.userId?.lastName}
                                    </h3>
                                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="flex items-center text-gray-600">
                                            <FaPhone className="mr-2 text-gray-400" />
                                            {appointment.patientId?.userId?.phoneNumber || 'Not provided'}
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <FaEnvelope className="mr-2 text-gray-400" />
                                            {appointment.patientId?.userId?.email || 'Not provided'}
                                        </div>
                                        <div className="text-gray-600">
                                            <span className="font-medium">Patient ID:</span> {appointment.patientId?.patientId}
                                        </div>
                                        <div className="text-gray-600">
                                            <span className="font-medium">Age:</span> {
                                                appointment.patientId?.userId?.dateOfBirth
                                                    ? (() => {
                                                        const birthDate = new Date(appointment.patientId.userId.dateOfBirth);
                                                        const today = new Date();
                                                        let age = today.getFullYear() - birthDate.getFullYear();
                                                        const monthDiff = today.getMonth() - birthDate.getMonth();
                                                        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                                                            age--;
                                                        }
                                                        return `${age} years`;
                                                    })()
                                                    : 'N/A'
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <button
                                    onClick={() => navigate(`/receptionist/patients/${appointment.patientId?._id}`)}
                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                    View Full Patient Profile →
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Actions & Doctor */}
                    <div className="space-y-6">
                        {/* Doctor Card */}
                        <div className="bg-white rounded-xl shadow p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <FaUserMd className="mr-2 text-purple-500" />
                                Doctor Information
                            </h2>

                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center">
                                        <FaUserMd className="h-8 w-8 text-purple-600" />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Dr. {appointment.doctorId?.firstName} {appointment.doctorId?.lastName}
                                    </h3>
                                    <p className="text-gray-600 mt-1">
                                        {appointment.doctorId?.specialization || 'General Physician'}
                                    </p>
                                    <div className="mt-3 space-y-2">
                                        <div className="flex items-center text-gray-600">
                                            <MdLocationOn className="mr-2 text-gray-400" />
                                            Room {appointment.doctorId?.roomNumber || '101'}
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <FaClock className="mr-2 text-gray-400" />
                                            Available: 8 AM - 6 PM
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl shadow p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>

                            <div className="space-y-3">
                                {appointment.status === 'scheduled' && (
                                    <>
                                        <button
                                            onClick={() => updateStatus('confirmed')}
                                            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                        >
                                            Mark as Confirmed
                                        </button>
                                        <button
                                            onClick={() => updateStatus('cancelled')}
                                            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                        >
                                            Cancel Appointment
                                        </button>
                                    </>
                                )}

                                {appointment.status === 'confirmed' && (
                                    <>
                                        <button
                                            onClick={() => updateStatus('completed')}
                                            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                                        >
                                            Mark as Completed
                                        </button>
                                        <button
                                            onClick={() => updateStatus('noShow')}
                                            className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                                        >
                                            Mark as No Show
                                        </button>
                                    </>
                                )}

                                <button
                                    onClick={() => navigate(`/receptionist/patients/${appointment.patientId?._id}/medical-records`)}
                                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
                                >
                                    <FaNotesMedical className="mr-2" />
                                    View Medical Records
                                </button>

                                <button
                                    onClick={() => navigate(`/receptionist/appointment-scheduling?patientId=${appointment.patientId?._id}`)}
                                    className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
                                >
                                    Schedule Follow-up
                                </button>

                                <button
                                    onClick={() => setShowDeleteModal(true)}
                                    className="w-full px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 mt-4"
                                >
                                    Delete Appointment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <FaCalendarAlt className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Appointment</h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Are you sure you want to delete this appointment? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
                            >
                                Delete Appointment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppointmentDetails;