// src/pages/patient/Telemedicine.js
import { useState } from 'react';
import { Video, Phone, MessageSquare, Users, Clock, Calendar, Mic, MicOff, Video as VideoIcon, VideoOff } from 'lucide-react';

const Telemedicine = () => {
    const [isCallActive, setIsCallActive] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming');

    const appointments = {
        upcoming: [
            {
                id: 1,
                doctor: 'Dr. Sarah Johnson',
                specialization: 'Cardiologist',
                date: 'Today',
                time: '10:30 AM',
                duration: '30 minutes',
                meetingId: 'tm-12345'
            },
            {
                id: 2,
                doctor: 'Dr. Michael Chen',
                specialization: 'Neurologist',
                date: 'Tomorrow',
                time: '2:00 PM',
                duration: '45 minutes',
                meetingId: 'tm-12346'
            }
        ],
        past: [
            {
                id: 3,
                doctor: 'Dr. Emily Wilson',
                specialization: 'Dermatologist',
                date: '2024-01-10',
                time: '11:00 AM',
                duration: '20 minutes',
                notes: 'Prescribed topical treatment'
            }
        ]
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Telemedicine</h1>
                    <p className="text-gray-600">Virtual consultations with your doctors</p>
                </div>
                {!isCallActive && (
                    <button className="mt-4 md:mt-0 btn-primary flex items-center">
                        <Video className="w-4 h-4 mr-2" />
                        Start Test Call
                    </button>
                )}
            </div>

            {isCallActive ? (
                /* Active Call Interface */
                <div className="bg-gray-900 rounded-2xl overflow-hidden">
                    <div className="p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Doctor Video */}
                            <div className="lg:w-2/3">
                                <div className="bg-black rounded-xl aspect-video relative">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Users className="w-12 h-12 text-white" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white">Dr. Sarah Johnson</h3>
                                            <p className="text-gray-300">Cardiologist</p>
                                            <div className="flex items-center justify-center mt-4 text-gray-400">
                                                <Clock className="w-5 h-5 mr-2" />
                                                <span>Call duration: 12:45</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Self Video */}
                                    <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-blue-500">
                                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                                            <div className="text-center">
                                                <Users className="w-8 h-8 text-white mx-auto mb-2" />
                                                <p className="text-white text-sm">You</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Call Controls & Info */}
                            <div className="lg:w-1/3">
                                <div className="bg-gray-800 rounded-xl p-6">
                                    <h3 className="text-lg font-bold text-white mb-4">Call Controls</h3>

                                    <div className="grid grid-cols-3 gap-4 mb-6">
                                        <button
                                            onClick={() => setIsMuted(!isMuted)}
                                            className={`p-4 rounded-lg flex flex-col items-center justify-center ${isMuted ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'
                                                }`}
                                        >
                                            {isMuted ? (
                                                <MicOff className="w-6 h-6 text-white" />
                                            ) : (
                                                <Mic className="w-6 h-6 text-white" />
                                            )}
                                            <span className="text-white text-sm mt-2">
                                                {isMuted ? 'Unmute' : 'Mute'}
                                            </span>
                                        </button>

                                        <button
                                            onClick={() => setIsVideoOn(!isVideoOn)}
                                            className={`p-4 rounded-lg flex flex-col items-center justify-center ${!isVideoOn ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'
                                                }`}
                                        >
                                            {isVideoOn ? (
                                                <VideoIcon className="w-6 h-6 text-white" />
                                            ) : (
                                                <VideoOff className="w-6 h-6 text-white" />
                                            )}
                                            <span className="text-white text-sm mt-2">
                                                {isVideoOn ? 'Video Off' : 'Video On'}
                                            </span>
                                        </button>

                                        <button className="p-4 rounded-lg bg-gray-700 hover:bg-gray-600 flex flex-col items-center justify-center">
                                            <MessageSquare className="w-6 h-6 text-white" />
                                            <span className="text-white text-sm mt-2">Chat</span>
                                        </button>
                                    </div>

                                    {/* Call Details */}
                                    <div className="mb-6">
                                        <h4 className="text-white font-medium mb-2">Appointment Details</h4>
                                        <div className="space-y-2 text-gray-300">
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-2" />
                                                <span>Today, January 15, 2024</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="w-4 h-4 mr-2" />
                                                <span>10:30 AM - 11:00 AM</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* End Call Button */}
                                    <button
                                        onClick={() => setIsCallActive(false)}
                                        className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center justify-center"
                                    >
                                        <Phone className="w-5 h-5 mr-2 transform rotate-135" />
                                        End Call
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Chat Panel */}
                        <div className="mt-6 bg-gray-800 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4">Chat</h3>
                            <div className="space-y-4 max-h-60 overflow-y-auto">
                                <div className="flex items-start">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                                        <span className="text-white text-sm">D</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-white font-medium">Dr. Johnson</p>
                                        <p className="text-gray-300">How have you been feeling since our last appointment?</p>
                                        <p className="text-gray-500 text-xs">10:31 AM</p>
                                    </div>
                                </div>

                                <div className="flex items-start justify-end">
                                    <div className="flex-1 max-w-md text-right">
                                        <p className="text-white font-medium">You</p>
                                        <div className="bg-blue-600 text-white p-3 rounded-lg inline-block">
                                            <p>Much better, the medication seems to be working well.</p>
                                        </div>
                                        <p className="text-gray-500 text-xs mt-1">10:32 AM</p>
                                    </div>
                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center ml-3">
                                        <span className="text-white text-sm">Y</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex">
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    className="flex-1 bg-gray-700 text-white rounded-l-lg px-4 py-2 focus:outline-none"
                                />
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700">
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* Telemedicine Dashboard */
                <>
                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="card">
                            <div className="flex items-center">
                                <div className="bg-blue-100 p-3 rounded-lg">
                                    <Video className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-500">Total Calls</p>
                                    <p className="text-2xl font-bold">8</p>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="flex items-center">
                                <div className="bg-green-100 p-3 rounded-lg">
                                    <Clock className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-500">Avg Duration</p>
                                    <p className="text-2xl font-bold">25m</p>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="flex items-center">
                                <div className="bg-purple-100 p-3 rounded-lg">
                                    <Calendar className="w-6 h-6 text-purple-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-500">Upcoming</p>
                                    <p className="text-2xl font-bold">2</p>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="flex items-center">
                                <div className="bg-yellow-100 p-3 rounded-lg">
                                    <Users className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-500">Doctors</p>
                                    <p className="text-2xl font-bold">4</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            {['upcoming', 'past', 'doctors'].map((tab) => (
                                <button
                                    key={tab}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Appointments List */}
                    {activeTab !== 'doctors' ? (
                        <div className="space-y-4">
                            {appointments[activeTab].map((appointment) => (
                                <div key={appointment.id} className="card hover:shadow-lg transition-shadow">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                                        <div className="flex items-start">
                                            <div className="bg-blue-100 p-3 rounded-lg">
                                                <Video className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="font-bold text-lg">{appointment.doctor}</h3>
                                                <p className="text-gray-600">{appointment.specialization}</p>
                                                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                                    <span className="flex items-center">
                                                        <Calendar className="w-4 h-4 mr-1" />
                                                        {appointment.date}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <Clock className="w-4 h-4 mr-1" />
                                                        {appointment.time} ({appointment.duration})
                                                    </span>
                                                </div>
                                                {appointment.meetingId && (
                                                    <p className="text-sm text-blue-600 mt-2">
                                                        Meeting ID: {appointment.meetingId}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-4 md:mt-0 flex space-x-2">
                                            {appointment.meetingId && (
                                                <button
                                                    onClick={() => setIsCallActive(true)}
                                                    className="btn-primary flex items-center"
                                                >
                                                    <Video className="w-4 h-4 mr-2" />
                                                    Join Call
                                                </button>
                                            )}
                                            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                                Reschedule
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Doctors Available for Telemedicine */
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                {
                                    id: 1,
                                    name: 'Dr. Sarah Johnson',
                                    specialization: 'Cardiologist',
                                    availability: 'Available now',
                                    rating: 4.9,
                                    nextSlot: 'Today, 3:00 PM'
                                },
                                {
                                    id: 2,
                                    name: 'Dr. Michael Chen',
                                    specialization: 'Neurologist',
                                    availability: 'Available in 2 hours',
                                    rating: 4.8,
                                    nextSlot: 'Tomorrow, 10:00 AM'
                                },
                                {
                                    id: 3,
                                    name: 'Dr. Emily Wilson',
                                    specialization: 'Dermatologist',
                                    availability: 'Available tomorrow',
                                    rating: 4.7,
                                    nextSlot: 'Jan 17, 2:30 PM'
                                },
                                {
                                    id: 4,
                                    name: 'Dr. Robert Brown',
                                    specialization: 'Pediatrician',
                                    availability: 'Available now',
                                    rating: 4.9,
                                    nextSlot: 'Today, 4:00 PM'
                                }
                            ].map((doctor) => (
                                <div key={doctor.id} className="card hover:shadow-lg transition-shadow">
                                    <div className="flex items-start">
                                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                            <Users className="w-8 h-8 text-gray-500" />
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-bold">{doctor.name}</h3>
                                                    <p className="text-gray-600">{doctor.specialization}</p>
                                                </div>
                                                <div className="flex items-center">
                                                    <div className="flex text-yellow-400">
                                                        {'★'.repeat(Math.floor(doctor.rating))}
                                                        <span className="text-gray-300">
                                                            {'★'.repeat(5 - Math.floor(doctor.rating))}
                                                        </span>
                                                    </div>
                                                    <span className="ml-2 text-sm text-gray-600">{doctor.rating}</span>
                                                </div>
                                            </div>

                                            <div className="mt-4 grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-500">Availability</p>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${doctor.availability.includes('now')
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {doctor.availability}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Next Available</p>
                                                    <p className="font-medium">{doctor.nextSlot}</p>
                                                </div>
                                            </div>

                                            <button className="w-full mt-4 btn-primary">
                                                Schedule Virtual Visit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Telemedicine Tips */}
                    <div className="card bg-blue-50">
                        <h3 className="font-bold text-lg text-blue-800 mb-4">Tips for Successful Virtual Visits</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start">
                                <div className="bg-white p-2 rounded-lg mr-3">
                                    <Video className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-blue-800">Test Your Equipment</p>
                                    <p className="text-blue-700 text-sm">Check camera, microphone, and internet connection before the call</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="bg-white p-2 rounded-lg mr-3">
                                    <MessageSquare className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-blue-800">Prepare Questions</p>
                                    <p className="text-blue-700 text-sm">Write down your questions and symptoms beforehand</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="bg-white p-2 rounded-lg mr-3">
                                    <Users className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-blue-800">Private Space</p>
                                    <p className="text-blue-700 text-sm">Find a quiet, private space for your consultation</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="bg-white p-2 rounded-lg mr-3">
                                    <Clock className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-blue-800">Be On Time</p>
                                    <p className="text-blue-700 text-sm">Join the call 5-10 minutes before your scheduled time</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Telemedicine;