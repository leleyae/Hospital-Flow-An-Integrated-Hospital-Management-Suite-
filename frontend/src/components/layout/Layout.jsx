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
    BarChart3,
    ChevronRight,
    Search,
    Home,
    Activity,
    AlertTriangle,
    Truck,
    UserPlus,
    Building,
    Video as VideoIcon,
    Moon,
    Sun,
    Sparkles
} from 'lucide-react';

const Layout = ({ children, role }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    const getRoleIcon = () => {
        const icons = {
            doctor: <Stethoscope className="w-6 h-6" />,
            nurse: <Users className="w-6 h-6" />,
            pharmacist: <Pill className="w-6 h-6" />,
            lab: <FlaskConical className="w-6 h-6" />,
            receptionist: <ClipboardCheck className="w-6 h-6" />,
            admin: <Shield className="w-6 h-6" />,
            patient: <User className="w-6 h-6" />
        };
        return icons[role] || <User className="w-6 h-6" />;
    };

    const getRoleGradient = () => {
        const gradients = {
            doctor: 'from-blue-500 to-cyan-400',
            nurse: 'from-green-500 to-emerald-400',
            pharmacist: 'from-purple-500 to-violet-400',
            lab: 'from-indigo-500 to-blue-400',
            receptionist: 'from-yellow-500 to-amber-400',
            admin: 'from-red-500 to-pink-400',
            patient: 'from-gray-600 to-gray-400'
        };
        return gradients[role] || 'from-gray-600 to-gray-400';
    };

    const getRoleGlow = () => {
        const glows = {
            doctor: 'shadow-blue-500/20',
            nurse: 'shadow-green-500/20',
            pharmacist: 'shadow-purple-500/20',
            lab: 'shadow-indigo-500/20',
            receptionist: 'shadow-yellow-500/20',
            admin: 'shadow-red-500/20'
        };
        return glows[role] || 'shadow-gray-500/20';
    };

    const getNavigationItems = () => {
        const baseItems = [
            {
                path: role === 'lab' ? '/lab_technician' : `/${role}`,
                icon: LayoutDashboard,
                label: 'Dashboard',
                description: 'Overview & analytics'
            },
        ];

        const roleNavs = {
            patient: [
                ...baseItems,
                { path: `/${role}/profile`, icon: User, label: 'Profile', description: 'Personal information' },
                { path: `/${role}/appointments`, icon: Calendar, label: 'Appointments', description: 'Schedule & history' },
                { path: `/${role}/medical-records`, icon: FileText, label: 'Medical Records', description: 'Health documents' },
                { path: `/${role}/prescriptions`, icon: Pill, label: 'Prescriptions', description: 'Medication list' },
                { path: `/${role}/billing`, icon: CreditCard, label: 'Billing', description: 'Payments & invoices' },
                { path: `/${role}/notifications`, icon: Bell, label: 'Notifications', description: 'Alerts & updates' },
                { path: `/${role}/telemedicine`, icon: VideoIcon, label: 'Telemedicine', description: 'Virtual consultations' },
            ],

            doctor: [
                ...baseItems,
                { path: `/${role}/patients`, icon: Users, label: 'Patients', description: 'Patient directory' },
                { path: `/${role}/lab-orders`, icon: Beaker, label: 'Lab Orders', description: 'Test requests' },
                // { path: `/${role}/telemedicine`, icon: VideoIcon, label: 'Telemedicine', description: 'Virtual sessions' },
            ],

            nurse: [
                ...baseItems,
                { path: `/${role}/triage`, icon: AlertTriangle, label: 'Triage', description: 'Priority assessment' },
                { path: `/${role}/patient-care`, icon: Users, label: 'Patient Care', description: 'Nursing care' },
                { path: `/${role}/medication`, icon: Pill, label: 'Medication', description: 'Drug administration' },
                { path: `/${role}/emergency`, icon: AlertTriangle, label: 'Emergency', description: 'Critical cases' },
                { path: `/${role}/vital-signs`, icon: Activity, label: 'Vital Signs', description: 'Patient monitoring' },
                { path: `/${role}/bed-management`, icon: Bed, label: 'Bed Management', description: 'Ward allocation' },
            ],

            pharmacist: [
                ...baseItems,
                { path: `/${role}/prescriptions`, icon: Truck, label: 'Prescriptions', description: 'Dispense medication' },
                { path: `/${role}/sales/otc`, icon: Package, label: 'OTC Sales', description: 'Over-the-counter' },
                { path: `/${role}/inventory`, icon: Package, label: 'Inventory', description: 'Stock management' },
                { path: `/${role}/inventory/add`, icon: Pill, label: 'Add Inventory', description: 'New stock' },
            ],

            lab_technician: [
                ...baseItems,
                { path: `/${role}/lab`, icon: Settings, label: 'Tests', description: 'Lab analysis' },
            ],

            receptionist: [
                ...baseItems,
                // { path: `/${role}/appointments`, icon: CreditCard, label: 'Appointments', description: 'Manage bookings' },
                { path: `/${role}/list`, icon: Users, label: 'Patient List', description: 'All patients' },
                { path: `/${role}/patient-registration`, icon: UserPlus, label: 'Registration', description: 'New patients' },
                { path: `/${role}/appointment-scheduling`, icon: Calendar, label: 'Scheduling', description: 'Book appointments' },
                // { path: `/${role}/billing`, icon: CreditCard, label: 'Billing', description: 'Payment processing' },
            ],

            admin: [
                ...baseItems,
                { path: `/${role}/users`, icon: Users, label: 'User Management', description: 'Staff & permissions' },
                { path: `/${role}/settings`, icon: Settings, label: 'System Settings', description: 'Configuration' },
                { path: `/${role}/audit-logs`, icon: FileText, label: 'Audit Logs', description: 'Activity tracking' },
                // { path: `/${role}/reports`, icon: BarChart3, label: 'Reports', description: 'Analytics & insights' },
            ],
        };

        return roleNavs[role] || baseItems;
    };

    const navigationItems = getNavigationItems();

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-50' : 'bg-gray-50'}`}>
            {/* Mobile Menu Button with Glow Effect */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className={`p-3 rounded-xl ${darkMode ? 'bg-gray-800/90 backdrop-blur-sm border border-gray-700 shadow-lg shadow-black/30' : 'bg-white shadow-lg'} transition-all duration-300 hover:scale-105`}
                >
                    {sidebarOpen ? (
                        <X className={`w-6 h-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
                    ) : (
                        <Menu className={`w-6 h-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
                    )}
                </button>
            </div>

            {/* Enhanced Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-40 w-80 transform transition-all duration-500 ease-out
                lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                ${darkMode
                    ? 'bg-gradient-to-b from-gray-900 to-black border-r border-gray-800'
                    : 'bg-white shadow-2xl'
                }
            `}>
                {/* Sidebar Content Container */}
                <div className="flex flex-col h-full">
                    {/* Logo Section with Animated Gradient */}
                    <div className={`p-6 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                        <div className="flex items-center space-x-4">
                            <div className={`
                                relative w-14 h-14 rounded-2xl 
                                bg-gradient-to-br ${getRoleGradient()} 
                                ${getRoleGlow()} shadow-2xl
                                flex items-center justify-center
                                transform transition-all duration-500 hover:scale-110
                                after:absolute after:inset-0 after:rounded-2xl 
                                after:bg-gradient-to-t after:from-transparent after:to-white/10
                            `}>
                                {getRoleIcon()}
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h1 className="font-bold text-xl bg-gradient-to-r from-gray-400 to-gray-300 bg-clip-text text-transparent">
                                        {role.charAt(0).toUpperCase() + role.slice(1)} Portal
                                    </h1>
                                    <button
                                        onClick={() => setDarkMode(!darkMode)}
                                        className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
                                    >
                                        {darkMode ?
                                            <Sun className="w-4 h-4 text-yellow-400" /> :
                                            <Moon className="w-4 h-4 text-gray-600" />
                                        }
                                    </button>
                                </div>

                                <div className="flex items-center mt-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                                    <span className={`text-lg ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                                        System Online
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="p-4">
                        <div className={`relative ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100'} rounded-xl p-2`}>
                            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <input
                                type="text"
                                placeholder="Search modules..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`w-full pl-10 pr-4 py-2 bg-transparent border-none outline-none text-lg ${darkMode ? 'text-gray-300 placeholder-gray-500' : 'text-gray-700'
                                    }`}
                            />
                        </div>
                    </div>

                    {/* Navigation with Enhanced Styling */}
                    <nav className="flex-1 overflow-y-auto py-2 px-4">
                        <div className="space-y-1">
                            {navigationItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.path;

                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`
                                            group relative flex items-center justify-between p-4 rounded-2xl
                                            transition-all duration-300 transform hover:translate-x-2
                                            ${isActive
                                                ? darkMode
                                                    ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/10 border border-blue-500/30 shadow-lg shadow-blue-500/10'
                                                    : 'bg-blue-50 border border-blue-200 shadow-lg'
                                                : darkMode
                                                    ? 'hover:bg-gray-800/50 border border-transparent hover:border-gray-700'
                                                    : 'hover:bg-gray-50 border border-transparent hover:border-gray-200'
                                            }
                                            overflow-hidden
                                        `}
                                    >
                                        {/* Animated Background Effect */}
                                        {isActive && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent"></div>
                                        )}

                                        <div className="flex items-center space-x-3">
                                            <div className={`
                                                relative w-10 h-10 rounded-xl flex items-center justify-center
                                                transition-all duration-300
                                                ${isActive
                                                    ? darkMode
                                                        ? 'bg-blue-500/20 text-blue-400'
                                                        : 'bg-blue-100 text-blue-600'
                                                    : darkMode
                                                        ? 'bg-gray-800/50 text-gray-400 group-hover:text-white'
                                                        : 'bg-gray-100 text-gray-600 group-hover:text-gray-900'
                                                }
                                            `}>
                                                <Icon className="w-5 h-5" />
                                                {isActive && (
                                                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={`
                                                    font-semibold text-lg
                                                    ${isActive
                                                        ? darkMode ? 'text-white' : 'text-gray-900'
                                                        : darkMode ? 'text-gray-300' : 'text-gray-700'
                                                    }
                                                `}>
                                                    {item.label}
                                                </span>
                                                <span className={`text-lg mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'
                                                    }`}>
                                                    {item.description}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Animated Chevron */}
                                        <ChevronRight className={`
                                            w-4 h-4 transition-all duration-300
                                            ${isActive
                                                ? 'text-blue-500 opacity-100'
                                                : 'text-gray-400 opacity-0 group-hover:opacity-100'
                                            }
                                        `} />

                                        {/* Hover Glow Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                    </Link>
                                );
                            })}
                        </div>


                    </nav>

                    {/* Enhanced User Profile Section */}
                    <div className={`border-t p-6 ${darkMode ? 'border-gray-800 bg-gradient-to-t from-gray-900 to-transparent' : 'border-gray-200'}`}>
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <div className={`
                                    w-12 h-12 rounded-xl bg-gradient-to-br ${getRoleGradient()}
                                    flex items-center justify-center shadow-lg ${getRoleGlow()}
                                    transform transition-transform duration-300 hover:scale-105
                                `}>
                                    <User className="w-6 h-6 text-white" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
                            </div>
                            <div className="flex-1">
                                <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    Dr. John Doe
                                </p>
                                <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {role.charAt(0).toUpperCase() + role.slice(1)}
                                </p>
                                <div className="flex items-center mt-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                    <span className="text-lg text-gray-500">Active now</span>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className={`
                                    p-3 rounded-xl transition-all duration-300
                                    ${darkMode
                                        ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-red-400'
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-red-500'
                                    }
                                    hover:scale-105
                                `}
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:ml-80">
                {/* Enhanced Top Bar */}
                <header className={`
                    h-16 flex items-center justify-between px-6
                    ${darkMode
                        ? 'bg-gray-900/80 backdrop-blur-lg border-b border-gray-800'
                        : 'bg-white shadow-sm'
                    }
                `}>
                    <div className="flex-1">
                        <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                            {navigationItems.find(item => location.pathname === item.path)?.label || 'Dashboard'}
                        </h2>
                        <p className={`text-lg mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Welcome back! Last login: Today, 09:42 AM
                        </p>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Notifications with Badge */}
                        {/*  */}

                    </div>
                </header>

                {/* Page Content */}
                <main className=" bg-gray-50">
                    {children}
                </main>
            </div>

            {/* Enhanced Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden animate-fadeIn"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

// Add custom styles for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    .animate-fadeIn {
        animation: fadeIn 0.3s ease-out;
    }
`;
document.head.appendChild(style);

export default Layout;