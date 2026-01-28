// src/layouts/DoctorLayout.jsx
import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar,
    Users,
    FileText,
    Pill,
    Beaker,
    Stethoscope,

    Video,
    AlertTriangle,
    Settings,
    Bell,
    User,
    Menu,
    X,
    LogOut
} from 'lucide-react';

const DoctorLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    const navItems = [
        { path: '/doctor', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/doctor/schedule', icon: Calendar, label: 'Schedule' },
        { path: '/doctor/patients', icon: Users, label: 'Patients' },
        { path: '/doctor/appointments', icon: Calendar, label: 'Appointments' },
        { path: '/doctor/prescriptions', icon: Pill, label: 'Prescriptions' },
        { path: '/doctor/lab-orders', icon: Beaker, label: 'Lab Orders' },
        { path: '/doctor/medical-records', icon: FileText, label: 'Medical Records' },
        { path: '/doctor/telemedicine', icon: Video, label: 'Telemedicine' },
        { path: '/doctor/triage', icon: AlertTriangle, label: 'Triage' },
        { path: '/doctor/settings', icon: Settings, label: 'Settings' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                        <div className="flex items-center">
                            <Stethoscope className="w-8 h-8 text-blue-600" />
                            <span className="ml-3 text-xl font-bold text-gray-900">MediCare</span>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Doctor Info */}
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <h3 className="font-medium text-gray-900">Dr. John Doe</h3>
<<<<<<< HEAD
                                <p className="text-lg text-gray-500">Cardiologist</p>
=======
                                <p className="text-sm text-gray-500">Cardiologist</p>
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${isActive
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                                    <span className="ml-3 font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="p-4 border-t border-gray-200">
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="ml-3 font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:pl-64">
                {/* Top Bar */}
                <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
                    <div className="flex items-center justify-between h-16 px-6">
                        <div className="flex items-center">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="text-gray-500 hover:text-gray-700 lg:hidden"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            <h1 className="ml-4 text-lg font-semibold text-gray-900 lg:ml-0">
                                Doctor Portal
                            </h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Notifications */}
                            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>

                            {/* User Menu */}
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-blue-600" />
                                </div>
<<<<<<< HEAD
                                <span className="ml-2 text-lg font-medium text-gray-700 hidden md:inline">
=======
                                <span className="ml-2 text-sm font-medium text-gray-700 hidden md:inline">
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                    Dr. John Doe
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="min-h-[calc(100vh-4rem)]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DoctorLayout;