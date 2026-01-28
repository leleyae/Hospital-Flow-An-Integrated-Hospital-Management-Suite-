import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    FaSearch,
    FaCalendarAlt,
    FaUserMd,
    FaClock,
    FaUser,
    FaPhone,
    FaArrowLeft
} from 'react-icons/fa';
import { FiCalendar, FiClock } from 'react-icons/fi';
import receptionistService from '../../services/receptionist.service';

const AppointmentScheduling = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialPatientId = queryParams.get('patientId');
    const [searchLoading, setSearchLoading] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);

    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');
    const [reason, setReason] = useState('');
    const [appointmentType, setAppointmentType] = useState('consultation');
    const [notes, setNotes] = useState('');

    // Modify the searchPatients function:
    const searchPatients = async () => {
        if (!searchTerm.trim()) {
            setPatients([]);
            setShowSearchResults(false);
            return;
        }

        try {
            setSearchLoading(true);
            const response = await receptionistService.getAllPatients(searchTerm);
            setPatients(response.data.data || []);
            setShowSearchResults(true);
        } catch (error) {
            console.error('Error searching patients:', error);
            alert('Failed to search patients');
        } finally {
            setSearchLoading(false);
        }
    };


    // Load initial data
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoading(true);

                // Load doctors
                const doctorsResponse = await receptionistService.getAllDoctors();
                setDoctors(doctorsResponse.data.data || []);

                // If patientId is provided in URL, load that patient
                if (initialPatientId) {
                    try {
                        const patientResponse = await receptionistService.getPatientById(initialPatientId);
                        setSelectedPatient(patientResponse.data.data);
                    } catch (error) {
                        console.error('Error loading patient:', error);
                    }
                }

                // Set default date to tomorrow
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                setAppointmentDate(tomorrow.toISOString().split('T')[0]);

                // Set default time to 9:00 AM
                setAppointmentTime('09:00');
            } catch (error) {
                console.error('Error loading initial data:', error);
                alert('Failed to load initial data');
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, [initialPatientId]);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.search-container')) {
                setShowSearchResults(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    // Search patients


    // Handle patient selection
    const handlePatientSelect = (patient) => {
        setSelectedPatient(patient);
        setPatients([]);
        setSearchTerm('');
    };

    // Schedule appointment
    const handleScheduleAppointment = async () => {
        // Validate required fields
        if (!selectedPatient) {
            alert('Please select a patient');
            return;
        }
        if (!selectedDoctor) {
            alert('Please select a doctor');
            return;
        }
        if (!appointmentDate) {
            alert('Please select an appointment date');
            return;
        }
        if (!appointmentTime) {
            alert('Please select an appointment time');
            return;
        }
        if (!reason.trim()) {
            alert('Please enter the reason for appointment');
            return;
        }

        try {
            setLoading(true);

            const appointmentData = {
                patientId: selectedPatient._id,
                doctorId: selectedDoctor,
                appointmentDate,
                appointmentTime,
                reason,
                type: appointmentType,
                notes
            };

            const response = await receptionistService.scheduleAppointment(appointmentData);

            if (response.data.success) {
                alert(`Appointment scheduled successfully!\nAppointment ID: ${response.data.data.appointmentId}`);

                // Ask if they want to schedule another appointment
                const scheduleAnother = window.confirm(
                    'Appointment scheduled successfully! Would you like to schedule another appointment?'
                );

                if (scheduleAnother) {
                    // Reset form but keep patient if they want
                    const keepPatient = window.confirm('Keep the same patient?');
                    if (!keepPatient) {
                        setSelectedPatient(null);
                    }
                    setSelectedDoctor('');
                    setReason('');
                    setNotes('');

                    // Set default date to tomorrow
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    setAppointmentDate(tomorrow.toISOString().split('T')[0]);
                    setAppointmentTime('09:00');
                } else {
                    navigate('/receptionist/appointments');
                }
            }
        } catch (error) {
            console.error('Error scheduling appointment:', error);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                error.message;
            alert(`Failed to schedule appointment: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    // Get tomorrow's date for minimum date
    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/receptionist')}
                        className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
                    >
                        <FaArrowLeft className="mr-2" />
                        Back to Dashboard
                    </button>

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Schedule Appointment</h1>
                    <p className="text-gray-600">Schedule a new appointment for a patient</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 space-y-8">
                    {/* Patient Selection */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <FaUser className="mr-2 text-blue-500" />
                            Select Patient
                        </h2>

                        {selectedPatient ? (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {selectedPatient.userId?.firstName} {selectedPatient.userId?.lastName}
                                        </h3>
<<<<<<< HEAD
                                        <div className="text-lg text-gray-600 mt-1 space-y-1">
=======
                                        <div className="text-sm text-gray-600 mt-1 space-y-1">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                            <p><strong>Patient ID:</strong> {selectedPatient.patientId}</p>
                                            <p><strong>Phone:</strong> {selectedPatient.userId?.phoneNumber || 'Not provided'}</p>
                                            <p><strong>Email:</strong> {selectedPatient.userId?.email || 'Not provided'}</p>
                                            {selectedPatient.userId?.dateOfBirth && (
                                                <p>
                                                    <strong>Age:</strong>{' '}
                                                    {(() => {
                                                        const birthDate = new Date(selectedPatient.userId.dateOfBirth);
                                                        const today = new Date();
                                                        let age = today.getFullYear() - birthDate.getFullYear();
                                                        const monthDiff = today.getMonth() - birthDate.getMonth();
                                                        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                                                            age--;
                                                        }
                                                        return `${age} years`;
                                                    })()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedPatient(null)}
<<<<<<< HEAD
                                        className="text-red-600 hover:text-red-800 text-lg"
=======
                                        className="text-red-600 hover:text-red-800 text-sm"
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                    >
                                        Change Patient
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>

                                <div className="relative search-container mb-4">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaSearch className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            if (e.target.value.trim()) {
                                                searchPatients();
                                            } else {
                                                setShowSearchResults(false);
                                            }
                                        }}
                                        onFocus={() => {
                                            if (searchTerm.trim() && patients.length > 0) {
                                                setShowSearchResults(true);
                                            }
                                        }}
                                        placeholder="Search patient by name, ID, phone, or email..."
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {searchLoading && (
                                        <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                        </div>
                                    )}
                                    <button
                                        onClick={searchPatients}
<<<<<<< HEAD
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-blue-600 text-white rounded text-lg hover:bg-blue-700"
=======
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                    >
                                        Search
                                    </button>

                                    {/* Enhanced Search Results Dropdown */}
                                    {showSearchResults && patients.length > 0 && (
                                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                                            {patients.map((patient) => (
                                                <div
                                                    key={patient._id}
                                                    onClick={() => {
                                                        handlePatientSelect(patient);
                                                        setShowSearchResults(false);
                                                    }}
                                                    className="p-3 border-b border-gray-100 hover:bg-blue-50 cursor-pointer last:border-b-0 transition-colors"
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <h4 className="font-medium text-gray-900">
                                                                {patient.userId?.firstName} {patient.userId?.lastName}
                                                            </h4>
<<<<<<< HEAD
                                                            <div className="text-lg text-gray-500 mt-1 space-x-2">
=======
                                                            <div className="text-sm text-gray-500 mt-1 space-x-2">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                                <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                                                                    ID: {patient.patientId}
                                                                </span>
                                                                {patient.userId?.phoneNumber && (
                                                                    <span className="flex items-center">
<<<<<<< HEAD
                                                                        <FaPhone className="inline mr-1 text-lg" />
=======
                                                                        <FaPhone className="inline mr-1 text-xs" />
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                                        {patient.userId.phoneNumber}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
<<<<<<< HEAD
                                                        <span className="text-blue-600 font-medium text-lg">Select</span>
=======
                                                        <span className="text-blue-600 font-medium text-sm">Select</span>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {loading && (
                                    <div className="text-center py-4">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                    </div>
                                )}

                                {patients.length > 0 && (
                                    <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                                        {patients.map((patient) => (
                                            <div
                                                key={patient._id}
                                                onClick={() => handlePatientSelect(patient)}
                                                className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer last:border-b-0"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">
                                                            {patient.userId?.firstName} {patient.userId?.lastName}
                                                        </h4>
<<<<<<< HEAD
                                                        <div className="text-lg text-gray-500 mt-1">
=======
                                                        <div className="text-sm text-gray-500 mt-1">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                                            <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                                                                {patient.patientId}
                                                            </span>
                                                            <span className="mx-2">•</span>
                                                            <span>{patient.userId?.phoneNumber || 'No phone'}</span>
                                                            <span className="mx-2">•</span>
                                                            <span>{patient.userId?.email}</span>
                                                        </div>
                                                    </div>
                                                    <button className="text-blue-600 hover:text-blue-800">
                                                        Select
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {patients.length === 0 && searchTerm && !loading && (
                                    <div className="text-center py-8 text-gray-500">
                                        <FaSearch className="text-3xl mx-auto mb-2 opacity-50" />
                                        <p>No patients found</p>
<<<<<<< HEAD
                                        <p className="text-lg mt-1">Try a different search term</p>
=======
                                        <p className="text-sm mt-1">Try a different search term</p>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                    </div>
                                )}

                                <div className="mt-4 text-center">
                                    <button
                                        onClick={() => navigate('/receptionist/register-patient')}
<<<<<<< HEAD
                                        className="text-blue-600 hover:text-blue-800 text-lg"
=======
                                        className="text-blue-600 hover:text-blue-800 text-sm"
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                    >
                                        Register a new patient instead
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Appointment Details */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <FaCalendarAlt className="mr-2 text-green-500" />
                            Appointment Details
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Doctor Selection */}
                            <div>
<<<<<<< HEAD
                                <label className="block text-lg font-medium text-gray-700 mb-2">
=======
                                <label className="block text-sm font-medium text-gray-700 mb-2">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                    <FaUserMd className="inline mr-1" />
                                    Select Doctor *
                                </label>
                                <select
                                    value={selectedDoctor}
                                    onChange={(e) => setSelectedDoctor(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Choose a doctor</option>
                                    {doctors.map((doctor) => (
                                        <option key={doctor._id} value={doctor._id}>
                                            Dr. {doctor.firstName} {doctor.lastName}
                                            {doctor.specialization ? ` - ${doctor.specialization}` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Appointment Type */}
                            <div>
<<<<<<< HEAD
                                <label className="block text-lg font-medium text-gray-700 mb-2">
=======
                                <label className="block text-sm font-medium text-gray-700 mb-2">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                    Appointment Type
                                </label>
                                <select
                                    value={appointmentType}
                                    onChange={(e) => setAppointmentType(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="consultation">Consultation</option>
                                    <option value="follow-up">Follow-up</option>
                                    <option value="checkup">Regular Checkup</option>
                                    <option value="emergency">Emergency</option>
                                    <option value="test">Test/Procedure</option>
                                    <option value="surgery">Surgery</option>
                                </select>
                            </div>

                            {/* Date and Time */}
                            <div>
<<<<<<< HEAD
                                <label className="block text-lg font-medium text-gray-700 mb-2">
=======
                                <label className="block text-sm font-medium text-gray-700 mb-2">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                    <FiCalendar className="inline mr-1" />
                                    Appointment Date *
                                </label>
                                <input
                                    type="date"
                                    value={appointmentDate}
                                    onChange={(e) => setAppointmentDate(e.target.value)}
                                    min={getTomorrowDate()}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
<<<<<<< HEAD
                                <label className="block text-lg font-medium text-gray-700 mb-2">
=======
                                <label className="block text-sm font-medium text-gray-700 mb-2">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                    <FiClock className="inline mr-1" />
                                    Appointment Time *
                                </label>
                                <input
                                    type="time"
                                    value={appointmentTime}
                                    onChange={(e) => setAppointmentTime(e.target.value)}
                                    min="08:00"
                                    max="18:00"
                                    step="900" // 15 minute intervals
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
<<<<<<< HEAD
                                <p className="text-lg text-gray-500 mt-1">Clinic hours: 8:00 AM - 6:00 PM</p>
=======
                                <p className="text-xs text-gray-500 mt-1">Clinic hours: 8:00 AM - 6:00 PM</p>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                            </div>

                            {/* Reason */}
                            <div className="md:col-span-2">
<<<<<<< HEAD
                                <label className="block text-lg font-medium text-gray-700 mb-2">
=======
                                <label className="block text-sm font-medium text-gray-700 mb-2">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                    Reason for Appointment *
                                </label>
                                <input
                                    type="text"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="e.g., Fever, regular checkup, follow-up for diabetes..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            {/* Notes */}
                            <div className="md:col-span-2">
<<<<<<< HEAD
                                <label className="block text-lg font-medium text-gray-700 mb-2">
=======
                                <label className="block text-sm font-medium text-gray-700 mb-2">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                    Additional Notes (Optional)
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Any additional information or special requirements..."
                                    rows="3"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Summary and Action */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Summary</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedPatient && (
                                <div>
<<<<<<< HEAD
                                    <p className="text-lg text-gray-600">Patient:</p>
=======
                                    <p className="text-sm text-gray-600">Patient:</p>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                    <p className="font-medium">
                                        {selectedPatient.userId?.firstName} {selectedPatient.userId?.lastName}
                                    </p>
                                </div>
                            )}

                            {selectedDoctor && (
                                <div>
<<<<<<< HEAD
                                    <p className="text-lg text-gray-600">Doctor:</p>
=======
                                    <p className="text-sm text-gray-600">Doctor:</p>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                    <p className="font-medium">
                                        {(() => {
                                            const doctor = doctors.find(d => d._id === selectedDoctor);
                                            return doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Not selected';
                                        })()}
                                    </p>
                                </div>
                            )}

                            {appointmentDate && (
                                <div>
<<<<<<< HEAD
                                    <p className="text-lg text-gray-600">Date:</p>
=======
                                    <p className="text-sm text-gray-600">Date:</p>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                    <p className="font-medium">
                                        {new Date(appointmentDate).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            )}

                            {appointmentTime && (
                                <div>
<<<<<<< HEAD
                                    <p className="text-lg text-gray-600">Time:</p>
=======
                                    <p className="text-sm text-gray-600">Time:</p>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                    <p className="font-medium">
                                        {new Date(`2000-01-01T${appointmentTime}`).toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            )}
                        </div>

                        {reason && (
                            <div className="mt-4">
<<<<<<< HEAD
                                <p className="text-lg text-gray-600">Reason:</p>
=======
                                <p className="text-sm text-gray-600">Reason:</p>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                <p className="font-medium">{reason}</p>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4">
                        <button
                            onClick={() => navigate('/receptionist')}
                            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleScheduleAppointment}
                            disabled={loading || !selectedPatient || !selectedDoctor || !appointmentDate || !appointmentTime || !reason}
                            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                    Scheduling...
                                </>
                            ) : (
                                <>
                                    <FaCalendarAlt className="mr-2" />
                                    Schedule Appointment
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentScheduling;