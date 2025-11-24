// src/components/layout/Layout.js
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Calendar,
    FileText,
    Pill,
    CreditCard,
    Beaker,
    Bell,
    Settings,
    LogOut,
    Menu,
    X,
    User,
    Package,
    Stethoscope,
    Bed,
    FlaskConical,
    ClipboardCheck,
    Shield,
    BarChart3
} from 'lucide-react';

const Layout = ({ children, role }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const getRoleIcon = () => {
        switch (role) {
            case 'doctor': return <Stethoscope className="w-5 h-5" />;
            case 'nurse': return <Users className="w-5 h-5" />;
            case 'pharmacist': return <Pill className="w-5 h-5" />;
            case 'lab': return <FlaskConical className="w-5 h-5" />;
            case 'receptionist': return <ClipboardCheck className="w-5 h-5" />;
            case 'admin': return <Shield className="w-5 h-5" />;
            default: return <User className="w-5 h-5" />;
        }
    };

    const getRoleColor = () => {
        switch (role) {
            case 'doctor': return 'bg-blue-500';
            case 'nurse': return 'bg-green-500';
            case 'pharmacist': return 'bg-purple-500';
            case 'lab': return 'bg-indigo-500';
            case 'receptionist': return 'bg-yellow-500';
            case 'admin': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const getNavigationItems = () => {
        const baseItems = [
            { path: `/${role}`, icon: LayoutDashboard, label: 'Dashboard' },
        ];

        switch (role) {
            case 'patient':
                return [
                    ...baseItems,
                    { path: `/${role}/profile`, icon: User, label: 'Profile' },
                    { path: `/${role}/appointments`, icon: Calendar, label: 'Appointments' },
                    { path: `/${role}/medical-records`, icon: FileText, label: 'Medical Records' },
                    { path: `/${role}/prescriptions`, icon: Pill, label: 'Prescriptions' },
                    { path: `/${role}/billing`, icon: CreditCard, label: 'Billing' },
                    { path: `/${role}/notifications`, icon: Bell, label: 'Notifications' },
                    { path: `/${role}/telemedicine`, icon: Video, label: 'Telemedicine' },
                ];

            case 'doctor':
                return [
                    ...baseItems,
                    { path: `/${role}/schedule`, icon: Calendar, label: 'Schedule' },
                    { path: `/${role}/patients`, icon: Users, label: 'Patients' },
                    { path: `/${role}/appointments`, icon: Calendar, label: 'Appointments' },
                    { path: `/${role}/prescriptions`, icon: Pill, label: 'Prescriptions' },
                    { path: `/${role}/lab-orders`, icon: Beaker, label: 'Lab Orders' },
                    { path: `/${role}/medical-records`, icon: FileText, label: 'Records' },
                    { path: `/${role}/telemedicine`, icon: Video, label: 'Telemedicine' },
                    { path: `/${role}/triage`, icon: AlertTriangle, label: 'Triage' },
                ];

            case 'nurse':
                return [
                    ...baseItems,
                    { path: `/${role}/triage`, icon: AlertTriangle, label: 'Triage' },
                    { path: `/${role}/patient-care`, icon: Users, label: 'Patient Care' },
                    { path: `/${role}/medication`, icon: Pill, label: 'Medication' },
                    { path: `/${role}/emergency`, icon: AlertTriangle, label: 'Emergency' },
                    { path: `/${role}/vital-signs`, icon: Activity, label: 'Vital Signs' },
                    { path: `/${role}/bed-management`, icon: Bed, label: 'Bed Management' },
                ];

            case 'pharmacist':
                return [
                    ...baseItems,
                    { path: `/${role}/inventory`, icon: Package, label: 'Inventory' },
                    { path: `/${role}/prescriptions`, icon: Pill, label: 'Prescriptions' },
                    { path: `/${role}/dispensing`, icon: Pill, label: 'Dispensing' },
                    { path: `/${role}/suppliers`, icon: Truck, label: 'Suppliers' },
                    { path: `/${role}/orders`, icon: Package, label: 'Orders' },
                    { path: `/${role}/drug-info`, icon: BookOpen, label: 'Drug Info' },
                ];

            case 'lab':
                return [
                    ...baseItems,
                    { path: `/${role}/tests`, icon: Beaker, label: 'Test Management' },
                    { path: `/${role}/equipment`, icon: Settings, label: 'Equipment' },
                    { path: `/${role}/results`, icon: FileText, label: 'Results' },
                    { path: `/${role}/quality-control`, icon: CheckCircle, label: 'Quality Control' },
                    { path: `/${role}/samples`, icon: Droplet, label: 'Samples' },
                ];

            case 'receptionist':
                return [
                    ...baseItems,
                    { path: `/${role}/appointments`, icon: CreditCard, label: 'Appointments' },
                    { path: `/${role}/list`, icon: Users, label: 'Patient List' },
                    { path: `/${role}/patient-registration`, icon: UserPlus, label: 'Registration' },
                    { path: `/${role}/appointment-scheduling`, icon: Calendar, label: 'Scheduling' },
                    { path: `/${role}/billing`, icon: CreditCard, label: 'Billing' },

                ];

            case 'admin':
                return [
                    ...baseItems,
                    { path: `/${role}/users`, icon: Users, label: 'User Management' },
                    { path: `/${role}/staff`, icon: Users, label: 'Staff Management' },
                    { path: `/${role}/departments`, icon: Building, label: 'Departments' },
                    { path: `/${role}/settings`, icon: Settings, label: 'System Settings' },
                    { path: `/${role}/audit-logs`, icon: FileText, label: 'Audit Logs' },
                    { path: `/${role}/reports`, icon: BarChart3, label: 'Reports' },
                ];

            default:
                return baseItems;
        }
    };

    const navigationItems = getNavigationItems();

    const handleLogout = () => {
        // Clear user session
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Menu Button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-lg bg-white shadow-md"
                >
                    {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Sidebar */}
            <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>

                {/* Logo */}
                <div className="h-16 flex items-center px-6 border-b">
                    <div className="flex items-center">
                        <div className={`w-10 h-10 ${getRoleColor()} rounded-lg flex items-center justify-center`}>
                            {getRoleIcon()}
                        </div>
                        <div className="ml-3">
                            <h1 className="font-bold text-lg">
                                {role.charAt(0).toUpperCase() + role.slice(1)} Portal
                            </h1>
                            <p className="text-xs text-gray-500">Hospital Management</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4">
                    <div className="px-4 space-y-1">
                        {navigationItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`
                    flex items-center px-4 py-3 rounded-lg transition-colors
                    ${isActive
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }
                  `}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="ml-3 font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* User Profile */}
                <div className="border-t  p-4">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-500" />
                        </div>
                        <div className="ml-3 flex-1">
                            <p className="font-medium">John Doe</p>
                            <p className="text-sm text-gray-500">{role}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:ml-64">
                {/* Top Bar */}
                <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold text-gray-800">
                            {navigationItems.find(item => location.pathname === item.path)?.label || 'Dashboard'}
                        </h2>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Notifications */}
                        <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                            <Bell className="w-5 h-5 text-gray-600" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        {/* Settings */}
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <Settings className="w-5 h-5 text-gray-600" />
                        </button>

                        {/* Quick Actions */}
                        <div className="hidden lg:flex items-center space-x-2">
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                                Quick Action
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    {children}
                </main>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

// Add missing icon imports
const Video = ({ className }) => <div className={className}>📹</div>;
const AlertTriangle = ({ className }) => <div className={className}>⚠️</div>;
const Activity = ({ className }) => <div className={className}>📈</div>;
const Truck = ({ className }) => <div className={className}>🚚</div>;
const BookOpen = ({ className }) => <div className={className}>📖</div>;
const CheckCircle = ({ className }) => <div className={className}>✓</div>;
const Droplet = ({ className }) => <div className={className}>💧</div>;
const UserPlus = ({ className }) => <div className={className}>👥</div>;
const Building = ({ className }) => <div className={className}>🏢</div>;

export default Layout;