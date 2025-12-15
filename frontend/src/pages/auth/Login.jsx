// src/pages/auth/Login.js - Professional Dark Mode with Split Design
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, Hospital, User, Users, Shield, LogIn, Sparkles, Moon, Sun } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// User data from your createUsers script
const QUICK_USERS = [
    // Admins
    { email: 'admin@hospital.com', password: 'admin123', role: 'admin', name: 'System Administrator', department: 'Administration' },

    // Doctors
    { email: 'dr.williams@hospital.com', password: 'Doctor123!', role: 'doctor', name: 'Dr. Sarah Williams', department: 'Cardiology' },

    // Nurses
    { email: 'nurse@hospital.com', password: 'nurse123', role: 'nurse', name: 'Emily Johnson, RN', department: 'Emergency' },

    // Pharmacists
    { email: 'pharmacist@hospital.com', password: 'pharmacist123', role: 'pharmacist', name: 'Michael Chen', department: 'Pharmacy' },

    // Receptionists
    { email: 'receptionist@hospital.com', password: 'receptionist123', role: 'receptionist', name: 'Jessica Miller', department: 'Front Desk' },

    // Lab Technicians
    { email: 'labtech@hospital.com', password: 'labtech123', role: 'lab_technician', name: 'David Rodriguez', department: 'Laboratory' },

    // Patients
    { email: 'patient@hospital.com', password: 'patient123', role: 'patient', name: 'Robert Wilson', department: 'Patient Care' },
];

// Professional role colors for dark mode
const ROLE_COLORS = {
    admin: 'bg-red-500/10 text-red-400 border-red-500/20',
    doctor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    nurse: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    pharmacist: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    receptionist: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    lab_technician: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    patient: 'bg-gray-500/10 text-gray-400 border-gray-500/20'
};

// Role icons with professional emoji representation
const ROLE_ICONS = {
    admin: '👑',
    doctor: '👨‍⚕️',
    nurse: '👩‍⚕️',
    pharmacist: '💊',
    receptionist: '💁',
    lab_technician: '🔬',
    patient: '👤'
};

const Login = ({ setUserRole, setUser }) => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'patient'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedRole, setSelectedRole] = useState('all');
    const [darkMode, setDarkMode] = useState(true);
    const [activeTab, setActiveTab] = useState('credentials');

    useEffect(() => {
        // Set dark mode as default
        document.documentElement.classList.add('dark');
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        if (darkMode) {
            document.documentElement.classList.remove('dark');
        } else {
            document.documentElement.classList.add('dark');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, {
                email: formData.email,
                password: formData.password
            });

            const { data } = response;

            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            const userRole = data.user.role;
            setUserRole(userRole);
            if (setUser) {
                setUser(data.user);
            }

            // Show success notification
            const user = QUICK_USERS.find(u => u.email === formData.email);
            const roleName = user?.role.replace('_', ' ') || userRole;

            setTimeout(() => {
                navigate(`/${userRole}`);
            }, 500);

        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleQuickLogin = (user) => {
        setFormData({
            email: user.email,
            password: user.password,
            role: user.role
        });
        setActiveTab('credentials');
    };

    const handleDirectLogin = async (user) => {
        setError('');
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, {
                email: user.email,
                password: user.password
            });

            const { data } = response;

            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            const userRole = data.user.role;
            setUserRole(userRole);
            if (setUser) {
                setUser(data.user);
            }

            navigate(`/${userRole}`);

        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Filter users by selected role
    const filteredUsers = selectedRole === 'all'
        ? QUICK_USERS
        : QUICK_USERS.filter(user => user.role === selectedRole);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex">
            {/* Left Panel - Hospital Info & Quick Login */}
            <div className="hidden lg:flex lg:w-1/2 p-8">
                <div className="relative w-full max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                                <Hospital className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">MediCare Pro</h1>
                                <p className="text-blue-300 text-lg">Hospital Management System</p>
                            </div>
                        </div>

                    </div>

                    {/* Hero Section */}
                    <div className="mb-12">
                        <div className="flex items-center space-x-2 text-blue-400 mb-4">
                            <Sparkles className="w-5 h-5" />
                            <span className="text-lg font-medium">SECURE ACCESS PORTAL</span>
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                            Advanced Healthcare<br />Management Platform
                        </h2>
                        <p className="text-gray-400 text-lg mb-8">
                            Integrated system for healthcare professionals to manage patients,
                            appointments, prescriptions, and hospital operations efficiently.
                        </p>


                    </div>

                    {/* Quick Login Section */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">



                        {/* User Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2">
                            {filteredUsers.map((user, index) => (
                                <div
                                    key={index}
                                    className={`p-4 rounded-xl cursor-pointer transition-all border ${formData.email === user.email
                                        ? 'ring-2 ring-blue-500/50 bg-gray-700/50 border-blue-500/30'
                                        : 'bg-gray-800/30 border-gray-700 hover:border-gray-600 hover:bg-gray-700/30'
                                        }`}
                                    onClick={() => handleQuickLogin(user)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center space-x-2 mb-1">
                                                <span className="text-lg">{ROLE_ICONS[user.role]}</span>
                                                <span className={`text-lg px-2 py-1 rounded-full ${ROLE_COLORS[user.role]}`}>
                                                    {user.role.replace('_', ' ')}
                                                </span>
                                            </div>
                                            <h4 className="font-medium text-white text-lg">{user.name}</h4>
                                            <p className="text-gray-400 text-lg mt-1">{user.department}</p>
                                            <p className="text-gray-500 text-lg truncate max-w-[200px]">{user.email}</p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDirectLogin(user);
                                            }}
                                            className="p-2 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg transition-colors"
                                            title="Direct Login"
                                        >
                                            <LogIn className="w-4 h-4 text-blue-400" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Stats */}
                        <div className="mt-6 pt-6 border-t border-gray-700/50">
                            <div className="flex justify-between text-lg">
                                <span className="text-gray-400">System Status:</span>
                                <span className="text-green-400 font-medium">● Operational</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center text-gray-500 text-lg">
                        <p>© 2024 MediCare Pro Hospital System v4.2</p>
                        <p className="mt-1 text-lg">Protected by end-to-end encryption</p>
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
                <div className="w-full max-w-md">
                    {/* Mobile Header */}
                    <div className="lg:hidden flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Hospital className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">MediCare Pro</h1>
                                <p className="text-blue-300 text-lg">HMS</p>
                            </div>
                        </div>
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700"
                        >
                            {darkMode ? (
                                <Sun className="w-5 h-5 text-amber-400" />
                            ) : (
                                <Moon className="w-5 h-5 text-gray-400" />
                            )}
                        </button>
                    </div>

                    {/* Login Card */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700/50">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Secure Login</h2>
                            <p className="text-gray-400 mt-2">Access your hospital management dashboard</p>
                        </div>

                        {/* Tabs */}
                        <div className="flex mb-6 border-b border-gray-700">
                            <button
                                onClick={() => setActiveTab('credentials')}
                                className={`flex-1 py-3 text-lg font-medium transition-colors ${activeTab === 'credentials'
                                    ? 'text-blue-400 border-b-2 border-blue-400'
                                    : 'text-gray-500 hover:text-gray-400'
                                    }`}
                            >
                                <Mail className="w-4 h-4 inline mr-2" />
                                Credentials
                            </button>
                            <button
                                onClick={() => setActiveTab('quick')}
                                className={`flex-1 py-3 text-lg font-medium transition-colors ${activeTab === 'quick'
                                    ? 'text-blue-400 border-b-2 border-blue-400'
                                    : 'text-gray-500 hover:text-gray-400'
                                    }`}
                            >
                                <Users className="w-4 h-4 inline mr-2" />
                                Quick Access
                            </button>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-lg">
                                <div className="flex items-center">
                                    <span className="mr-2">⚠</span>
                                    {error}
                                </div>
                            </div>
                        )}

                        {/* Credentials Tab */}
                        {activeTab === 'credentials' && (
                            <>
                                {/* Selected User Preview */}
                                {formData.email && (
                                    <div className="mb-6 p-4 bg-gray-700/30 rounded-xl border border-gray-600/50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center mr-3">
                                                    <User className="w-5 h-5 text-gray-300" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-white text-lg">
                                                        {QUICK_USERS.find(u => u.email === formData.email)?.name || 'User Selected'}
                                                    </div>
                                                    <div className="text-lg text-gray-400">{formData.email}</div>
                                                </div>
                                            </div>
                                            <span className={`text-lg px-2 py-1 rounded-full ${ROLE_COLORS[formData.role]}`}>
                                                {formData.role.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-lg font-medium text-gray-300 mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-10 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                                                placeholder="professional@hospital.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-lg font-medium text-gray-300 mb-2">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="w-full px-10 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent pr-10 transition-all"
                                                placeholder="••••••••"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center cursor-pointer">
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only"
                                                />
                                                <div className="w-5 h-5 bg-gray-700 border border-gray-600 rounded flex items-center justify-center">
                                                    <div className="w-3 h-3 bg-blue-500 rounded hidden"></div>
                                                </div>
                                            </div>
                                            <span className="ml-2 text-lg text-gray-400">Remember me</span>
                                        </label>
                                        <Link
                                            to="/forgot-password"
                                            className="text-lg text-blue-400 hover:text-blue-300 transition-colors"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                                Authenticating...
                                            </>
                                        ) : (
                                            <>
                                                <LogIn className="w-5 h-5 mr-2" />
                                                Access Dashboard
                                            </>
                                        )}
                                    </button>
                                </form>
                            </>
                        )}

                        {/* Quick Access Tab */}
                        {activeTab === 'quick' && (
                            <div className="space-y-4">
                                <div className="text-lg text-gray-400 mb-4">
                                    Select a role and click to auto-fill credentials
                                </div>
                                <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                                    {QUICK_USERS.map((user, index) => (
                                        <div
                                            key={index}
                                            className={`p-4 rounded-xl cursor-pointer transition-all border ${formData.email === user.email
                                                ? 'ring-2 ring-blue-500/50 bg-gray-700/50 border-blue-500/30'
                                                : 'bg-gray-700/30 border-gray-600 hover:border-gray-500 hover:bg-gray-700/50'
                                                }`}
                                            onClick={() => handleQuickLogin(user)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="text-2xl">{ROLE_ICONS[user.role]}</div>
                                                    <div>
                                                        <div className="font-medium text-white">{user.name}</div>
                                                        <div className="text-lg text-gray-400">{user.email}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`text-lg px-2 py-1 rounded-full ${ROLE_COLORS[user.role]}`}>
                                                        {user.role.replace('_', ' ')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setActiveTab('credentials')}
                                    className="w-full mt-4 py-2 text-lg text-blue-400 hover:text-blue-300"
                                >
                                    ← Back to login form
                                </button>
                            </div>
                        )}

                        {/* Sign Up Link */}
                        <div className="mt-8 pt-6 border-t border-gray-700/50 text-center">
                            <p className="text-gray-500 text-lg">
                                Need access?{' '}
                                <Link
                                    to="/register"
                                    className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    Request account
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <div className="text-lg text-gray-500 space-y-1">
                            <p>🔒 Encrypted Connection • HIPAA Compliant • ISO 27001 Certified</p>
                            <p className="text-gray-600">Use Ctrl+Shift+I for developer tools</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Add these styles to your global CSS or Tailwind config
const globalStyles = `
/* Add to your global CSS file */
.dark {
  color-scheme: dark;
}

/* Custom scrollbar for dark mode */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(31, 41, 55, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(75, 85, 99, 0.8);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(107, 114, 128, 0.8);
}

/* Smooth transitions */
* {
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

/* Focus styles */
input:focus, button:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}
`;

export default Login;