// src/pages/receptionist/DashboardHome.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FaUsers,
    FaCalendarCheck,
    FaMoneyBillWave,
    FaBed,
    FaClock,
    FaExclamationTriangle,
    FaUserPlus,
    FaCheckCircle
} from 'react-icons/fa';
import receptionistService from '../../services/receptionist.service';


const DashboardHome = () => {
    const [stats, setStats] = useState({
        totalPatients: 0,
        activePatients: 0,
        todaysAppointments: 0,
        pendingAppointments: 0,
        availableRooms: 0,
        pendingBills: 0,
        totalRevenue: 0
    });
    const [loading, setLoading] = useState(true);
    const [todaysAppointments, setTodaysAppointments] = useState([]);
    const [recentPatients, setRecentPatients] = useState([]);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);

            // Load dashboard stats
            const statsData = await receptionistService.getDashboardStats();
            setStats(statsData.data);

            // Load today's appointments
            const today = new Date().toISOString().split('T')[0];
            const appointmentsData = await receptionistService.getAppointments({ date: today });
            setTodaysAppointments(appointmentsData.data.appointments.slice(0, 5));

            // Load recent patients
            const patientsData = await receptionistService.getPatients();
            setRecentPatients(patientsData.data.patients.slice(0, 5));

        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ icon: Icon, title, value, color, link, subtitle }) => (
        <Link to={link} className="block">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                    <div className={`p-3 rounded-full ${color} bg-opacity-20`}>
                        <Icon className={`text-2xl ${color.split(' ')[1]}`} />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">{title}</p>
                        <p className="text-2xl font-semibold text-gray-900">
                            {loading ? '...' : value}
                        </p>
                        {subtitle && (
                            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );

    const getAppointmentStatusBadge = (status) => {
        const statusConfig = {
            'scheduled': { color: 'bg-blue-100 text-blue-800', text: 'Scheduled' },
            'confirmed': { color: 'bg-green-100 text-green-800', text: 'Confirmed' },
            'checked-in': { color: 'bg-purple-100 text-purple-800', text: 'Checked In' },
            'in-progress': { color: 'bg-yellow-100 text-yellow-800', text: 'In Progress' },
            'pending': { color: 'bg-gray-100 text-gray-800', text: 'Pending' }
        };

        const config = statusConfig[status] || statusConfig.pending;
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                {config.text}
            </span>
        );
    };

    const getPatientStatusBadge = (status) => {
        return status === 'active' ? (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
            </span>
        ) : (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Inactive
            </span>
        );
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
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
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Reception Dashboard</h1>
                <p className="text-gray-600">Welcome back! Heres whats happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    icon={FaUsers}
                    title="Total Patients"
                    value={stats.totalPatients}
                    color="text-blue-500"
                    link="/receptionist/patient-registration"
                />
                <StatCard
                    icon={FaCalendarCheck}
                    title="Today's Appointments"
                    value={stats.todaysAppointments}
                    color="text-green-500"
                    link="/receptionist/check-in"
                    subtitle={`${stats.pendingAppointments} pending`}
                />
                <StatCard
                    icon={FaMoneyBillWave}
                    title="Pending Bills"
                    value={stats.pendingBills}
                    color="text-yellow-500"
                    link="/receptionist/billing"
                    subtitle={`Revenue: ${formatCurrency(stats.totalRevenue)}`}
                />
                <StatCard
                    icon={FaBed}
                    title="Available Rooms"
                    value={stats.availableRooms}
                    color="text-purple-500"
                    link="/receptionist/room-management"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Today's Appointments */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Todays Appointments</h2>
                        <Link
                            to="/receptionist/check-in"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            View All →
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {todaysAppointments.length > 0 ? (
                            todaysAppointments.map((appointment, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                    <div>
                                        <p className="font-medium text-gray-900">{appointment.patientName}</p>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <FaClock className="mr-1" />
                                            {appointment.time} • {appointment.doctorName}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {getAppointmentStatusBadge(appointment.status)}
                                        <p className="text-xs text-gray-500 mt-1">{appointment.type}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">No appointments today</p>
                        )}
                    </div>
                </div>

                {/* Recent Patients */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Patients</h2>
                        <Link
                            to="/receptionist/patient-registration"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            View All →
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentPatients.length > 0 ? (
                            recentPatients.map((patient, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {patient.firstName} {patient.lastName}
                                        </p>
                                        <p className="text-sm text-gray-500">ID: {patient.patientId}</p>
                                    </div>
                                    <div className="text-right">
                                        {getPatientStatusBadge(patient.status)}
                                        <p className="text-xs text-gray-500 mt-1">
                                            {patient.age} years • {patient.gender}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">No recent patients</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link
                        to="/receptionist/patient-registration?action=new"
                        className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                        <FaUserPlus className="text-2xl text-blue-600 mb-2" />
                        <span className="font-medium text-gray-900">Register Patient</span>
                    </Link>

                    <Link
                        to="/receptionist/check-in?action=checkin"
                        className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                    >
                        <FaCheckCircle className="text-2xl text-green-600 mb-2" />
                        <span className="font-medium text-gray-900">Check-in Patient</span>
                    </Link>

                    <Link
                        to="/receptionist/billing?action=new"
                        className="flex flex-col items-center justify-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
                    >
                        <FaMoneyBillWave className="text-2xl text-yellow-600 mb-2" />
                        <span className="font-medium text-gray-900">Create Invoice</span>
                    </Link>

                    <Link
                        to="/receptionist/room-management?action=assign"
                        className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                        <FaBed className="text-2xl text-purple-600 mb-2" />
                        <span className="font-medium text-gray-900">Assign Room</span>
                    </Link>
                </div>
            </div>

            {/* Notifications */}
            <div className="mt-8">
                <div className="flex items-center mb-4">
                    <FaExclamationTriangle className="text-yellow-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="space-y-2">
                        <div className="flex items-center text-sm">
                            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                            <span className="text-gray-700">
                                <span className="font-medium">Emergency case</span> in Room 301 - Robert Brown needs immediate attention
                            </span>
                        </div>
                        <div className="flex items-center text-sm">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                            <span className="text-gray-700">
                                <span className="font-medium">3 appointments</span> are running late today
                            </span>
                        </div>
                        <div className="flex items-center text-sm">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                            <span className="text-gray-700">
                                <span className="font-medium">Room 302</span> is under maintenance until 5 PM
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;