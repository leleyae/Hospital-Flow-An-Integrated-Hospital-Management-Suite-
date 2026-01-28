<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    CalendarDays,
    FileText,
    FlaskRound,
    CreditCard,
    User,
    Bell,
    Settings,
    LogOut,
    Clock,
    CheckCircle,
    AlertCircle,
    Pill,
    Activity,
    Heart,
    Thermometer,
    Droplets
} from 'lucide-react';

const PatientDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/patients2/dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDashboardData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                    <h2 className="mt-4 text-xl font-semibold text-gray-900">Unable to load dashboard</h2>
                    <p className="mt-2 text-gray-600">Please try again later</p>
                </div>
            </div>
        );
    }

    const { patient, stats, upcomingAppointments, activePrescriptions, recentLabTests, outstandingBills } = dashboardData;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <Activity className="h-8 w-8 text-blue-600" />
                            <h1 className="ml-3 text-2xl font-bold text-gray-900">MediCare Patient Portal</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="p-2 text-gray-400 hover:text-gray-500">
                                <Bell className="h-6 w-6" />
                            </button>
                            <div className="flex items-center space-x-3">
                                <img
                                    src={patient.user?.profilePicture || 'https://via.placeholder.com/40'}
                                    alt="Profile"
                                    className="h-10 w-10 rounded-full"
                                />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {patient.user?.firstName} {patient.user?.lastName}
                                    </p>
                                    <p className="text-xs text-gray-500">Patient ID: {patient.patientId}</p>
                                </div>
                            </div>
                            <button className="p-2 text-gray-400 hover:text-gray-500">
                                <Settings className="h-6 w-6" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-500">
                                <LogOut className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation */}
            <nav className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-8">
                        {[
                            { id: 'dashboard', label: 'Dashboard', icon: Activity },
                            { id: 'appointments', label: 'Appointments', icon: CalendarDays },
                            { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
                            { id: 'lab-tests', label: 'Lab Tests', icon: FlaskRound },
                            { id: 'bills', label: 'Bills', icon: CreditCard },
                            { id: 'records', label: 'Medical Records', icon: FileText },
                            { id: 'profile', label: 'Profile', icon: User }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <tab.icon className="h-5 w-5 mr-2" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Welcome back, {patient.user?.firstName}!
                    </h2>
                    <p className="text-gray-600 mt-2">
                        Here's your health summary and recent activities.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <CalendarDays className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Upcoming Appointments</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.upcomingAppointments}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <Pill className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Active Prescriptions</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.activePrescriptions}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <FlaskRound className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Recent Lab Tests</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.recentLabTests}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <CreditCard className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Pending Bills</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.pendingBills}</p>
                            </div>
=======
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
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                        </div>
                    </div>
                </div>

<<<<<<< HEAD
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Upcoming Appointments */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-6 border-b">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <CalendarDays className="h-5 w-5 mr-2 text-blue-600" />
                                Upcoming Appointments
                            </h3>
                        </div>
                        <div className="p-6">
                            {upcomingAppointments.length > 0 ? (
                                <div className="space-y-4">
                                    {upcomingAppointments.map((appointment) => (
                                        <div key={appointment._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {appointment.doctorId?.userId?.firstName} {appointment.doctorId?.userId?.lastName}
                                                </p>
                                                <p className="text-sm text-gray-600">{appointment.doctorId?.specialization}</p>
                                                <div className="flex items-center mt-1">
                                                    <Clock className="h-4 w-4 text-gray-400 mr-1" />
                                                    <span className="text-sm text-gray-600">
                                                        {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.startTime}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${appointment.appointmentStatus === 'completed'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {appointment.appointmentStatus}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">No upcoming appointments</p>
                            )}
                        </div>
                    </div>

                    {/* Active Prescriptions */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-6 border-b">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <Pill className="h-5 w-5 mr-2 text-green-600" />
                                Active Prescriptions
                            </h3>
                        </div>
                        <div className="p-6">
                            {activePrescriptions.length > 0 ? (
                                <div className="space-y-4">
                                    {activePrescriptions.map((prescription) => (
                                        <div key={prescription._id} className="p-4 bg-gray-50 rounded-lg">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium text-gray-900">{prescription.medications[0]?.medicineName}</p>
                                                    <p className="text-sm text-gray-600">
                                                        Dosage: {prescription.medications[0]?.dosage} | {prescription.medications[0]?.frequency}
                                                    </p>
                                                </div>
                                                <CheckCircle className="h-5 w-5 text-green-500" />
                                            </div>
                                            <div className="mt-2 text-sm text-gray-600">
                                                <p>Valid until: {new Date(prescription.validUntil).toLocaleDateString()}</p>
                                                <p className="mt-1">Refills remaining: {prescription.medications[0]?.refills}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">No active prescriptions</p>
                            )}
                        </div>
                    </div>

                    {/* Recent Lab Tests */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-6 border-b">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <FlaskRound className="h-5 w-5 mr-2 text-purple-600" />
                                Recent Lab Tests
                            </h3>
                        </div>
                        <div className="p-6">
                            {recentLabTests.length > 0 ? (
                                <div className="space-y-4">
                                    {recentLabTests.map((test) => (
                                        <div key={test._id} className="p-4 bg-gray-50 rounded-lg">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium text-gray-900">{test.testName}</p>
                                                    <p className="text-sm text-gray-600">
                                                        Test ID: {test.testId} | {test.testType}
                                                    </p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${test.status === 'completed'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {test.status}
                                                </span>
                                            </div>
                                            {test.testParameters && test.testParameters.length > 0 && (
                                                <div className="mt-4 space-y-2">
                                                    {test.testParameters.slice(0, 2).map((param, index) => (
                                                        <div key={index} className="flex items-center justify-between text-sm">
                                                            <span className="text-gray-600">{param.parameter}</span>
                                                            <span className={`font-medium ${param.value.includes('Normal') ? 'text-green-600' : 'text-red-600'
                                                                }`}>
                                                                {param.value} {param.unit}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">No recent lab tests</p>
                            )}
                        </div>
                    </div>

                    {/* Outstanding Bills */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-6 border-b">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <CreditCard className="h-5 w-5 mr-2 text-yellow-600" />
                                Outstanding Bills
                            </h3>
                        </div>
                        <div className="p-6">
                            {outstandingBills.length > 0 ? (
                                <div className="space-y-4">
                                    {outstandingBills.map((bill) => (
                                        <div key={bill._id} className="p-4 bg-gray-50 rounded-lg">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium text-gray-900">Invoice #{bill.invoiceId}</p>
                                                    <p className="text-sm text-gray-600">
                                                        Date: {new Date(bill.invoiceDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <span className="text-lg font-bold text-red-600">
                                                    ${bill.balance.toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="mt-2 flex items-center justify-between">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${bill.status === 'paid'
                                                    ? 'bg-green-100 text-green-800'
                                                    : bill.status === 'partial'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {bill.status}
                                                </span>
                                                <span className="text-sm text-gray-600">
                                                    Due: {new Date(bill.dueDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">No outstanding bills</p>
                            )}
=======
                <div className="card">
                    <div className="flex items-center">
                        <div className="bg-green-100 p-3 rounded-lg">
                            <Pill className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">Active Prescriptions</p>
                            <p className="text-2xl font-bold">{stats.pendingPrescriptions}</p>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                        </div>
                    </div>
                </div>

<<<<<<< HEAD
                {/* Health Summary */}
                <div className="mt-8 bg-white rounded-lg shadow">
                    <div className="p-6 border-b">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <Heart className="h-5 w-5 mr-2 text-red-600" />
                            Health Summary
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <Droplets className="h-8 w-8 text-blue-600 mx-auto" />
                                <p className="mt-2 text-sm text-gray-600">Blood Group</p>
                                <p className="text-xl font-bold text-gray-900">{patient.bloodGroup || 'N/A'}</p>
                            </div>

                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <Thermometer className="h-8 w-8 text-green-600 mx-auto" />
                                <p className="mt-2 text-sm text-gray-600">Height</p>
                                <p className="text-xl font-bold text-gray-900">
                                    {patient.height ? `${patient.height} cm` : 'N/A'}
                                </p>
                            </div>

                            <div className="text-center p-4 bg-yellow-50 rounded-lg">
                                <Activity className="h-8 w-8 text-yellow-600 mx-auto" />
                                <p className="mt-2 text-sm text-gray-600">Weight</p>
                                <p className="text-xl font-bold text-gray-900">
                                    {patient.weight ? `${patient.weight} kg` : 'N/A'}
                                </p>
                            </div>

                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                                <User className="h-8 w-8 text-purple-600 mx-auto" />
                                <p className="mt-2 text-sm text-gray-600">Primary Doctor</p>
                                <p className="text-sm font-medium text-gray-900">
                                    {patient.primaryCarePhysician?.userId?.firstName || 'Not assigned'}
                                </p>
                            </div>
                        </div>

                        {/* Medical Conditions */}
                        {patient.medicalConditions && patient.medicalConditions.length > 0 && (
                            <div className="mt-8">
                                <h4 className="font-medium text-gray-900 mb-4">Medical Conditions</h4>
                                <div className="space-y-3">
                                    {patient.medicalConditions.map((condition, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                            <div>
                                                <p className="font-medium text-gray-900">{condition.condition}</p>
                                                <p className="text-sm text-gray-600">Status: {condition.status}</p>
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {new Date(condition.diagnosedDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Allergies */}
                        {patient.allergies && patient.allergies.length > 0 && (
                            <div className="mt-8">
                                <h4 className="font-medium text-gray-900 mb-4">Allergies</h4>
                                <div className="flex flex-wrap gap-2">
                                    {patient.allergies.map((allergy, index) => (
                                        <span
                                            key={index}
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${allergy.severity === 'Critical'
                                                ? 'bg-red-100 text-red-800'
                                                : allergy.severity === 'High'
                                                    ? 'bg-orange-100 text-orange-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                }`}
                                        >
                                            {allergy.allergen} ({allergy.severity})
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t mt-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="text-sm text-gray-500">
                            © {new Date().getFullYear()} MediCare Hospital. All rights reserved.
                        </div>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                                Privacy Policy
                            </a>
                            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                                Terms of Service
                            </a>
                            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                                Contact Support
                            </a>
                            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                                Emergency: 911
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
=======
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
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
        </div>
    );
};

<<<<<<< HEAD
export default PatientDashboard;
=======
export default DashboardHome;
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
