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
                        </div>
                    </div>
                </div>

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
                        </div>
                    </div>
                </div>

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
        </div>
    );
};

export default PatientDashboard;