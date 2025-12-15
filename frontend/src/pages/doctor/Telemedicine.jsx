// src/pages/doctor/Telemedicine.jsx
import React, { useState, useEffect } from 'react';
import {
    Video,
    Phone,
    Mic,
    MicOff,
    VideoOff,
    PhoneOff,
    Users,
    MessageSquare,
    Settings,
    User,
    Clock,
    Calendar,
    PhoneCall,
    MoreVertical
} from 'lucide-react';
import doctorService from '../../services/doctorService';


const Telemedicine = () => {
    const [isCallActive, setIsCallActive] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [activeCalls, setActiveCalls] = useState([]);
    const [upcomingCalls, setUpcomingCalls] = useState([]);
    const [loading, setLoading] = useState(false);

    // Simulated data
    useEffect(() => {
        // Simulate fetching active and upcoming calls
        setActiveCalls([
            {
                id: 1,
                patientName: 'John Doe',
                patientId: 'PAT00123',
                startTime: '10:30 AM',
                duration: '15 min',
                status: 'connected'
            }
        ]);

        setUpcomingCalls([
            {
                id: 1,
                patientName: 'Jane Smith',
                patientId: 'PAT00456',
                appointmentTime: '2:00 PM',
                date: 'Today',
                type: 'Follow-up'
            },
            {
                id: 2,
                patientName: 'Robert Johnson',
                patientId: 'PAT00789',
                appointmentTime: '3:30 PM',
                date: 'Today',
                type: 'Consultation'
            }
        ]);
    }, []);

    const startNewCall = () => {
        setIsCallActive(true);
        // Here you would integrate with WebRTC or other video calling service
    };

    const endCall = () => {
        setIsCallActive(false);
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const toggleVideo = () => {
        setIsVideoOff(!isVideoOff);
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Telemedicine</h1>
                <p className="text-gray-600 mt-2">Virtual consultations and remote patient care</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Call Interface */}
                <div className="lg:col-span-2">
                    {/* Call Interface */}
                    <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden">
                        {isCallActive ? (
                            <>
                                {/* Active Call */}
                                <div className="relative h-96">
                                    {/* Patient Video */}
                                    <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <User className="w-12 h-12 text-white" />
                                            </div>
                                            <h3 className="text-white text-xl font-semibold">John Doe</h3>
                                            <p className="text-gray-400">PAT00123</p>
                                            <div className="mt-4 flex items-center justify-center space-x-2 text-gray-400">
                                                <Clock className="w-4 h-4" />
                                                <span>15:32</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Doctor's Video (Picture-in-picture) */}
                                    <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-700 rounded-lg border-2 border-blue-500 overflow-hidden">
                                        <div className="w-full h-full flex items-center justify-center">
                                            {isVideoOff ? (
                                                <div className="text-center">
                                                    <VideoOff className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                    <p className="text-lg text-gray-400">Camera Off</p>
                                                </div>
                                            ) : (
                                                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                                                    <User className="w-8 h-8 text-white" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Call Controls */}
                                <div className="bg-gray-800 p-6">
                                    <div className="flex items-center justify-center space-x-6">
                                        <button
                                            onClick={toggleMute}
                                            className={`w-14 h-14 rounded-full flex items-center justify-center ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                                                } transition-colors duration-200`}
                                        >
                                            {isMuted ? (
                                                <MicOff className="w-6 h-6 text-white" />
                                            ) : (
                                                <Mic className="w-6 h-6 text-white" />
                                            )}
                                        </button>

                                        <button
                                            onClick={toggleVideo}
                                            className={`w-14 h-14 rounded-full flex items-center justify-center ${isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                                                } transition-colors duration-200`}
                                        >
                                            {isVideoOff ? (
                                                <VideoOff className="w-6 h-6 text-white" />
                                            ) : (
                                                <Video className="w-6 h-6 text-white" />
                                            )}
                                        </button>

                                        <button
                                            onClick={endCall}
                                            className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                                        >
                                            <PhoneOff className="w-7 h-7 text-white" />
                                        </button>

                                        <button className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors duration-200">
                                            <MessageSquare className="w-6 h-6 text-white" />
                                        </button>

                                        <button className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors duration-200">
                                            <Settings className="w-6 h-6 text-white" />
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (

                            <button
                                onClick={startNewCall}
                                className="px-8 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-200 flex items-center text-lg font-medium"
                            >
                                <PhoneCall className="w-5 h-5 mr-2" />
                                Start New Call
                            </button>

                        )}
                    </div>

                    {/* Call Notes */}
                    <div className="mt-6 bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Consultation Notes</h3>
                        <textarea
                            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            placeholder="Add notes from the consultation..."
                            disabled={!isCallActive}
                        />
                        <div className="flex justify-end mt-4">
                            <button
                                disabled={!isCallActive}
                                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${isCallActive
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                Save Notes
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column - Call Information */}
                <div className="space-y-6">
                    {/* Active Calls */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Active Calls</h3>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-lg font-medium">
                                {activeCalls.length} Active
                            </span>
                        </div>

                        {activeCalls.length > 0 ? (
                            <div className="space-y-4">
                                {activeCalls.map(call => (
                                    <div key={call.id} className="p-4 border border-green-200 rounded-lg bg-green-50">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                                    <User className="w-5 h-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900">{call.patientName}</h4>
                                                    <p className="text-lg text-gray-500">{call.patientId}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                                </span>
                                                <span className="text-lg text-green-600">Live</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-lg text-gray-600">
                                            <div className="flex items-center">
                                                <Clock className="w-3 h-3 mr-1" />
                                                Started: {call.startTime}
                                            </div>
                                            <div>Duration: {call.duration}</div>
                                        </div>
                                        <button className="w-full mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 flex items-center justify-center">
                                            <PhoneOff className="w-4 h-4 mr-2" />
                                            End Call
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <PhoneOff className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No active calls</p>
                            </div>
                        )}
                    </div>

                    {/* Upcoming Calls */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Upcoming Calls</h3>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-lg font-medium">
                                {upcomingCalls.length} Scheduled
                            </span>
                        </div>

                        {upcomingCalls.length > 0 ? (
                            <div className="space-y-4">
                                {upcomingCalls.map(call => (
                                    <div key={call.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                                    <User className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900">{call.patientName}</h4>
                                                    <p className="text-lg text-gray-500">{call.patientId}</p>
                                                </div>
                                            </div>
                                            <button className="text-gray-400 hover:text-gray-600">
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between text-lg text-gray-600">
                                            <div className="flex items-center">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                {call.date}
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="w-3 h-3 mr-1" />
                                                {call.appointmentTime}
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                                {call.type}
                                            </span>
                                        </div>
                                        <button className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                                            Start Call
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No upcoming calls</p>
                            </div>
                        )}
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Telemedicine Stats</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <p className="text-2xl font-bold text-blue-900">12</p>
                                <p className="text-lg text-blue-600">Calls Today</p>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <p className="text-2xl font-bold text-green-900">4.7</p>
                                <p className="text-lg text-green-600">Avg Rating</p>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                                <p className="text-2xl font-bold text-purple-900">48</p>
                                <p className="text-lg text-purple-600">This Week</p>
                            </div>
                            <div className="text-center p-4 bg-yellow-50 rounded-lg">
                                <p className="text-2xl font-bold text-yellow-900">22m</p>
                                <p className="text-lg text-yellow-600">Avg Duration</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Telemedicine;