// src/pages/patient/Appointments.js
import { useState } from 'react';
import { CalendarDays, Clock, User, Video, Phone, MapPin, Search, Filter, Plus } from 'lucide-react';

const Appointments = () => {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [searchQuery, setSearchQuery] = useState('');

    const appointments = {
        upcoming: [
            {
                id: 1,
                doctor: 'Dr. Sarah Johnson',
                specialization: 'Cardiologist',
                date: '2024-01-15',
                time: '10:30 AM',
                type: 'Consultation',
                status: 'confirmed',
                telemedicine: true
            },
            {
                id: 2,
                doctor: 'Dr. Michael Chen',
                specialization: 'Neurologist',
                date: '2024-01-18',
                time: '2:00 PM',
                type: 'Follow-up',
                status: 'confirmed',
                telemedicine: false
            }
        ],
        past: [
            {
                id: 3,
                doctor: 'Dr. Emily Wilson',
                specialization: 'Dermatologist',
                date: '2024-01-05',
                time: '11:00 AM',
                type: 'Checkup',
                status: 'completed',
                telemedicine: false
            }
        ],
        cancelled: [
            {
                id: 4,
                doctor: 'Dr. Robert Brown',
                specialization: 'Orthopedic',
                date: '2024-01-10',
                time: '3:30 PM',
                type: 'Consultation',
                status: 'cancelled',
                telemedicine: false
            }
        ]
    };

    const doctors = [
        {
            id: 1,
            name: 'Dr. Sarah Johnson',
            specialization: 'Cardiologist',
            rating: 4.8,
            availableSlots: ['Mon 10AM', 'Wed 2PM', 'Fri 11AM'],
            consultationFee: '$150'
        },
        {
            id: 2,
            name: 'Dr. Michael Chen',
            specialization: 'Neurologist',
            rating: 4.9,
            availableSlots: ['Tue 9AM', 'Thu 3PM'],
            consultationFee: '$180'
        }
    ];

    const handleBookAppointment = (doctorId) => {
        // Implementation for booking appointment
        console.log('Booking appointment with doctor:', doctorId);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Appointments</h1>
                    <p className="text-gray-600">Manage and schedule your appointments</p>
                </div>
                <button className="mt-4 md:mt-0 btn-primary flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Book New Appointment
                </button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search appointments, doctors, or symptoms..."
                        className="input-field pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </button>
                    <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <CalendarDays className="w-4 h-4 mr-2" />
                        Calendar View
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {['upcoming', 'past', 'cancelled'].map((tab) => (
                        <button
                            key={tab}
                            className={`py-2 px-1 border-b-2 font-medium text-lg ${activeTab === tab
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                                {appointments[tab].length}
                            </span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Appointments List */}
            <div className="space-y-4">
                {appointments[activeTab].map((appointment) => (
                    <div key={appointment.id} className="card hover:shadow-lg transition-shadow duration-200">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-start">
                                    <div className="bg-blue-100 p-3 rounded-lg">
                                        <User className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="font-bold text-lg">{appointment.doctor}</h3>
                                        <p className="text-gray-600">{appointment.specialization}</p>
                                        <div className="flex items-center mt-2 space-x-4 text-lg text-gray-500">
                                            <span className="flex items-center">
                                                <CalendarDays className="w-4 h-4 mr-1" />
                                                {appointment.date}
                                            </span>
                                            <span className="flex items-center">
                                                <Clock className="w-4 h-4 mr-1" />
                                                {appointment.time}
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {appointment.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 md:mt-0 flex space-x-2">
                                {appointment.status === 'confirmed' && appointment.telemedicine && (
                                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                        <Video className="w-4 h-4 mr-2" />
                                        Join Call
                                    </button>
                                )}
                                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                    Reschedule
                                </button>
                                <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
                                    Cancel
                                </button>
                            </div>
                        </div>

                        {appointment.status === 'upcoming' && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <button className="flex items-center text-lg text-blue-600 hover:text-blue-700">
                                            <Phone className="w-4 h-4 mr-1" />
                                            Call Doctor
                                        </button>
                                        <button className="flex items-center text-lg text-blue-600 hover:text-blue-700">
                                            <MapPin className="w-4 h-4 mr-1" />
                                            Get Directions
                                        </button>
                                    </div>
                                    <button className="text-lg text-gray-600 hover:text-gray-800">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Available Doctors Section */}
            <div className="card">
                <h2 className="text-xl font-bold mb-6">Available Doctors</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {doctors.map((doctor) => (
                        <div key={doctor.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                            <div className="flex items-start">
                                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <User className="w-8 h-8 text-gray-500" />
                                </div>
                                <div className="ml-4 flex-1">
                                    <h3 className="font-bold">{doctor.name}</h3>
                                    <p className="text-gray-600">{doctor.specialization}</p>
                                    <div className="flex items-center mt-2">
                                        <div className="flex text-yellow-400">
                                            {'★'.repeat(Math.floor(doctor.rating))}
                                            <span className="text-gray-300">
                                                {'★'.repeat(5 - Math.floor(doctor.rating))}
                                            </span>
                                        </div>
                                        <span className="ml-2 text-lg text-gray-600">{doctor.rating}</span>
                                    </div>
                                    <div className="mt-3 flex items-center justify-between">
                                        <div>
                                            <p className="text-lg text-gray-500">Available Slots:</p>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {doctor.availableSlots.map((slot, idx) => (
                                                    <span key={idx} className="px-2 py-1 bg-gray-100 rounded text-xs">
                                                        {slot}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold">{doctor.consultationFee}</p>
                                            <button
                                                onClick={() => handleBookAppointment(doctor.id)}
                                                className="mt-2 btn-primary text-lg py-1.5 px-3"
                                            >
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Appointment Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-bold text-lg text-blue-800 mb-2">Appointment Tips</h3>
                <ul className="space-y-2 text-blue-700">
                    <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Arrive 15 minutes before your scheduled appointment</span>
                    </li>
                    <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Bring your insurance card and photo ID</span>
                    </li>
                    <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Prepare a list of medications youre currently taking</span>
                    </li>
                    <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Note down any symptoms or concerns you want to discuss</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Appointments;