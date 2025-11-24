// src/components/layout/PharmacistLayout.jsx
import { useState } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import {
    FaHome,
    FaPills,
    FaClipboardList,
    FaTruck,
    FaBoxes,
    FaUserMd,
    FaSignOutAlt,
    FaBars,
    FaTimes,
    FaBell,
    FaUser
} from 'react-icons/fa';
import { authService } from '../../services/auth.service';

const PharmacistLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    if (!authService.isAuthenticated()) {
        return <Navigate to="/login" />;
    }

    const navigation = [
        { name: 'Dashboard', href: '/pharmacist', icon: FaHome },
        { name: 'Inventory', href: '/pharmacist/inventory', icon: FaPills },
        { name: 'Prescriptions', href: '/pharmacist/prescriptions', icon: FaClipboardList },
        { name: 'Dispensing', href: '/pharmacist/dispensing', icon: FaBoxes },
        { name: 'Suppliers', href: '/pharmacist/suppliers', icon: FaTruck },
        { name: 'Orders', href: '/pharmacist/orders', icon: FaTruck },
        { name: 'Drug Info', href: '/pharmacist/drug-info', icon: FaUserMd },
    ];

    const handleLogout = () => {
        authService.removeToken();
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
                <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white shadow-xl">
                    <div className="flex items-center justify-between h-16 px-4 border-b">
                        <span className="text-xl font-bold text-blue-600">Pharmacy System</span>
                        <button onClick={() => setSidebarOpen(false)}>
                            <FaTimes className="text-gray-500" />
                        </button>
                    </div>
                    <nav className="flex-1 px-4 py-4 space-y-1">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${isActive
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <item.icon className="mr-3" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
                <div className="flex flex-col flex-1 bg-white shadow-xl">
                    <div className="flex items-center h-16 px-4 border-b">
                        <span className="text-xl font-bold text-blue-600">Pharmacy System</span>
                    </div>
                    <nav className="flex-1 px-4 py-4 space-y-1">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${isActive
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <item.icon className="mr-3" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                    <div className="p-4 border-t">
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50"
                        >
                            <FaSignOutAlt className="mr-3" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <div className="bg-white shadow">
                    <div className="flex justify-between items-center h-16 px-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-900"
                        >
                            <FaBars />
                        </button>

                        <div className="flex-1"></div>

                        <div className="flex items-center space-x-4">
                            <button className="relative p-2 text-gray-500 hover:text-gray-900">
                                <FaBell />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>

                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                    <FaUser className="text-blue-600" />
                                </div>
                                <span className="ml-2 text-sm font-medium text-gray-700">
                                    Pharmacist
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="py-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default PharmacistLayout;