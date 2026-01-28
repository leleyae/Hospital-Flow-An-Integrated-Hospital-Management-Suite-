// src/pages/doctor/PatientAppointments.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, ChevronRight } from 'lucide-react';
import doctorService from '../../services/doctorService';

const PatientAppointments = () => {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPatientAndAppointments();
    }, [patientId]);

    const fetchPatientAndAppointments = async () => {
        try {
            setLoading(true);
            // Fetch patient details
            const patientResponse = await doctorService.getPatientById(patientId);
            setPatient(patientResponse);
<<<<<<< HEAD
            console.log(patientResponse)
=======
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd

            // Fetch patient appointments
            const appointmentsResponse = await doctorService.getPatientAppointments(patientId);
            setAppointments(appointmentsResponse.appointments || []);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'confirmed': 'bg-blue-100 text-blue-800',
            'completed': 'bg-green-100 text-green-800',
            'cancelled': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
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
            <div className="mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Patients
                </button>

                <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {patient?.userId?.firstName} {patient?.userId?.lastName}
                        </h1>
                        <p className="text-gray-600">Patient ID: {patient?.patientId}</p>
                    </div>
                </div>

<<<<<<< HEAD
                <div className="flex items-center space-x-4 text-lg text-gray-600">
=======
                <div className="flex items-center space-x-4 text-sm text-gray-600">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                    <span>📧 {patient?.userId?.email}</span>
                    <span>📞 {patient?.userId?.phoneNumber || 'N/A'}</span>
                    {patient?.bloodGroup && <span>🩸 Blood Group: {patient.bloodGroup}</span>}
                </div>
            </div>

            {/* Appointments List */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Appointments</h2>
<<<<<<< HEAD
                    <p className="text-lg text-gray-600">All appointments with this patient</p>
=======
                    <p className="text-sm text-gray-600">All appointments with this patient</p>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                </div>

                <div className="divide-y divide-gray-200">
                    {appointments.length > 0 ? (
                        appointments.map((appointment) => (
                            <div
                                key={appointment._id}
                                className="px-6 py-4 hover:bg-gray-50 cursor-pointer"
                                onClick={() => navigate(`/doctor/appointments/${appointment._id}`)}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center space-x-3">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span className="font-medium text-gray-900">
<<<<<<< HEAD
                                                {patient?.userId?.firstName} {patient?.userId?.lastName}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-3 mt-2 text-lg text-gray-600">
                                            <Clock className="w-4 h-4" />
                                            <span>{appointment.startTime} - {appointment.endTime}</span>
                                            <span className={`px-2 py-1 rounded-full text-lg ${getStatusColor(appointment.status)}`}>
=======
                                                {formatDate(appointment.appointmentDate)}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-3 mt-2 text-sm text-gray-600">
                                            <Clock className="w-4 h-4" />
                                            <span>{appointment.startTime} - {appointment.endTime}</span>
                                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(appointment.status)}`}>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                {appointment.status}
                                            </span>
                                        </div>
                                        {appointment.reason && (
<<<<<<< HEAD
                                            <p className="mt-2 text-lg text-gray-700">{appointment.reason}</p>
=======
                                            <p className="mt-2 text-sm text-gray-700">{appointment.reason}</p>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                        )}
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="px-6 py-12 text-center">
                            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                            <p className="text-gray-600">This patient has no appointment history</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
<<<<<<< HEAD
                    <p className="text-lg text-blue-600 font-medium">Total Appointments</p>
                    <p className="text-2xl font-bold text-blue-900">{appointments.length}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-lg text-green-600 font-medium">Completed</p>
=======
                    <p className="text-sm text-blue-600 font-medium">Total Appointments</p>
                    <p className="text-2xl font-bold text-blue-900">{appointments.length}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600 font-medium">Completed</p>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                    <p className="text-2xl font-bold text-green-900">
                        {appointments.filter(a => a.status === 'completed').length}
                    </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
<<<<<<< HEAD
                    <p className="text-lg text-yellow-600 font-medium">Upcoming</p>
=======
                    <p className="text-sm text-yellow-600 font-medium">Upcoming</p>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                    <p className="text-2xl font-bold text-yellow-900">
                        {appointments.filter(a => a.status === 'pending' || a.status === 'confirmed').length}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PatientAppointments; 