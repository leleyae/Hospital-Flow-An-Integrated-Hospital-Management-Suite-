// src/pages/patient/DashboardHome.js
import React from 'react';
import { Link } from 'react-router-dom';
import {
    CalendarDays,
    FileText,
    Pill,
    CreditCard,
    Beaker,
    Bell,
    Video,
    User,
    Clock,
    TrendingUp
} from 'lucide-react';

const DashboardHome = () => {
    const stats = {
        upcomingAppointments: 2,
        pendingPrescriptions: 1,
        unpaidInvoices: 1,
        recentLabResults: 3
    };

    const upcomingAppointments = [
        { id: 1, doctor: 'Dr. Sarah Johnson', time: '10:30 AM', date: 'Today', type: 'Consultation' },
        { id: 2, doctor: 'Dr. Michael Chen', time: '2:00 PM', date: 'Tomorrow', type: 'Follow-up' }
    ];

    const quickActions = [
        { icon: CalendarDays, label: 'Book Appointment', link: '/patient/appointments/book', color: 'bg-blue-100 text-blue-600' },
        { icon: FileText, label: 'View Records', link: '/patient/medical-records', color: 'bg-green-100 text-green-600' },
        { icon: Pill, label: 'Prescriptions', link: '/patient/prescriptions', color: 'bg-purple-100 text-purple-600' },
        { icon: CreditCard, label: 'Pay Bills', link: '/patient/billing', color: 'bg-yellow-100 text-yellow-600' }
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Welcome back, John!</h1>
                        <p className="text-blue-100 mt-1">Here's what's happening with your health today</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors">
                            <Bell className="w-5 h-5" />
                        </button>
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card">
                    <div className="flex items-center">
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <CalendarDays className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">Upcoming Appointments</p>
                            <p className="text-2xl font-bold">{stats.upcomingAppointments}</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center">
                        <div className="bg-green-100 p-3 rounded-lg">
                            <Pill className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">Active Prescriptions</p>
                            <p className="text-2xl font-bold">{stats.pendingPrescriptions}</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center">
                        <div className="bg-yellow-100 p-3 rounded-lg">
                            <CreditCard className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">Pending Bills</p>
                            <p className="text-2xl font-bold">${stats.unpaidInvoices * 150}</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center">
                        <div className="bg-purple-100 p-3 rounded-lg">
                            <Beaker className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">Lab Results</p>
                            <p className="text-2xl font-bold">{stats.recentLabResults}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => (
                        <Link
                            key={index}
                            to={action.link}
                            className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                        >
                            <div className={`p-3 rounded-full ${action.color}`}>
                                <action.icon className="w-6 h-6" />
                            </div>
                            <span className="mt-2 text-sm font-medium">{action.label}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="card">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Upcoming Appointments</h2>
                    <Link to="/patient/appointments" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        View All
                    </Link>
                </div>
                <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                        <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div className="flex items-center">
                                <div className="bg-blue-100 p-3 rounded-lg">
                                    <CalendarDays className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="font-medium">{appointment.doctor}</p>
                                    <p className="text-sm text-gray-500">{appointment.type} • {appointment.date} at {appointment.time}</p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                {appointment.date === 'Today' && (
                                    <Link
                                        to={`/patient/telemedicine/${appointment.id}`}
                                        className="flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium"
                                    >
                                        <Video className="w-4 h-4 mr-1" />
                                        Join
                                    </Link>
                                )}
                                <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                                    Reschedule
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                    <h2 className="text-xl font-bold mb-4">Recent Prescriptions</h2>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <div>
                                <p className="font-medium">Amoxicillin 500mg</p>
                                <p className="text-sm text-gray-600">Dr. Sarah Johnson • 2 days ago</p>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                Active
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium">Lisinopril 10mg</p>
                                <p className="text-sm text-gray-600">Dr. Michael Chen • 1 week ago</p>
                            </div>
                            <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-xs font-medium">
                                Completed
                            </span>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h2 className="text-xl font-bold mb-4">Health Metrics</h2>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">Blood Pressure</span>
                                <span className="text-sm text-gray-500">120/80 mmHg</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">Glucose Level</span>
                                <span className="text-sm text-gray-500">95 mg/dL</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">Cholesterol</span>
                                <span className="text-sm text-gray-500">180 mg/dL</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;