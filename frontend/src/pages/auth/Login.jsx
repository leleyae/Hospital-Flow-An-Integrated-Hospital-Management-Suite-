// src/pages/auth/Login.js - Updated with user quick login sidebar
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, Hospital, User, Users, ChevronRight } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// User data from your createUsers script (simplified)
const QUICK_USERS = [
    // Admins
    { email: 'admin@hospital.com', password: 'admin123', role: 'admin', name: 'Test Admin' },

    // Doctors
    { email: 'dr.williams@hospital.com', password: 'Doctor123!', role: 'doctor', name: 'Test Doctor' },

    // Nurses
    { email: 'nurse@hospital.com', password: 'nurse123', role: 'nurse', name: 'Test Nurse' },

    // Pharmacists
    { email: 'pharmacist@hospital.com', password: 'pharmacist123', role: 'pharmacist', name: 'Test Pharmacist' },

    // Receptionists
    { email: 'receptionist@hospital.com', password: 'receptionist123', role: 'receptionist', name: 'Test Receptionist' },

    // Lab Technicians
    { email: 'labtech@hospital.com', password: 'labtech123', role: 'lab_technician', name: 'Test Lab Tech' },

    // Patients
    { email: 'patient@hospital.com', password: 'patient123', role: 'patient', name: 'Test Patient' },
];

// Role colors for styling
const ROLE_COLORS = {
    admin: 'bg-red-100 text-red-800 border-red-200',
    doctor: 'bg-blue-100 text-blue-800 border-blue-200',
    nurse: 'bg-green-100 text-green-800 border-green-200',
    pharmacist: 'bg-purple-100 text-purple-800 border-purple-200',
    receptionist: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    lab_technician: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    patient: 'bg-gray-100 text-gray-800 border-gray-200'
};

// Role icons mapping
const ROLE_ICONS = {
    admin: '',
    doctor: '',
    nurse: '',
    pharmacist: '',
    receptionist: '',
    lab_technician: '',
    patient: ''
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
    const [showUserSidebar, setShowUserSidebar] = useState(true);
    const [selectedRole, setSelectedRole] = useState('all');

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


            localStorage.setItem('user', JSON.stringify(data));
            const userRole = data.role;
            setUserRole(userRole);
            if (setUser) {
                setUser(data);
            }
            navigate(`/${userRole}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
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

        // Auto-login after filling form
        setTimeout(() => {
            const submitButton = document.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.click();
            }
        }, 100);
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
            const userRole = data.user.role;
            setUserRole(userRole);
            localStorage.setItem('token', data.token);
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

    // Group users by role for display
    const usersByRole = QUICK_USERS.reduce((groups, user) => {
        if (!groups[user.role]) {
            groups[user.role] = [];
        }
        groups[user.role].push(user);
        return groups;
    }, {});

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
            {/* User Sidebar */}
            {showUserSidebar && (
                <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                                <Users className="w-6 h-6 text-blue-600 mr-2" />
                                <h2 className="text-lg font-semibold text-gray-900">Quick Login</h2>
                            </div>
                            <button
                                onClick={() => setShowUserSidebar(false)}
                                className="p-1 hover:bg-gray-100 rounded-lg"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>


                        {/* User List */}
                        <div className="space-y-3">
                            {filteredUsers.map((user, index) => (
                                <div
                                    key={index}
                                    className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md group ${formData.email === user.email
                                        ? 'ring-2 ring-blue-500 ring-opacity-50 ' + ROLE_COLORS[user.role]
                                        : 'bg-white border-gray-200 hover:border-gray-300'
                                        }`}
                                    onClick={() => handleQuickLogin(user)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${ROLE_COLORS[user.role].split(' ')[0]}`}>
                                                <span className="text-sm">{ROLE_ICONS[user.role]}</span>
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 text-sm">{user.name}</div>
                                                <div className="text-xs text-gray-500 truncate max-w-[180px]">{user.email}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className={`text-xs px-2 py-1 rounded-full ${ROLE_COLORS[user.role]}`}>
                                                {user.role.replace('_', ' ')}
                                            </span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDirectLogin(user);
                                                }}
                                                className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                Login
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Instructions */}
                        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h3 className="text-sm font-medium text-blue-800 mb-2">How to use:</h3>
                            <ul className="text-xs text-blue-700 space-y-1">
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Click any user to auto-fill the login form</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Click "Login" button for instant login</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Filter users by role using the tabs above</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Login Area */}
            <div className={`flex-1 flex items-center justify-center p-4 transition-all duration-300 ${showUserSidebar ? '' : 'max-w-2xl mx-auto'}`}>
                <div className={`${showUserSidebar ? 'max-w-md' : 'max-w-lg'} w-full`}>
                    {/* Show Sidebar Toggle if hidden */}
                    {!showUserSidebar && (
                        <button
                            onClick={() => setShowUserSidebar(true)}
                            className="absolute top-4 left-4 p-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50"
                        >
                            <Users className="w-5 h-5 text-gray-600" />
                        </button>
                    )}

                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                                <Hospital className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Hospital Management</h1>
                        <p className="text-gray-600 mt-2">Sign in to your account</p>
                        {showUserSidebar && (
                            <p className="text-sm text-gray-500 mt-1">
                                Or use quick login from the sidebar →
                            </p>
                        )}
                    </div>

                    {/* Login Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Current User Preview */}
                        {formData.email && (
                            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                            <User className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">
                                                {QUICK_USERS.find(u => u.email === formData.email)?.name || 'User selected'}
                                            </div>
                                            <div className="text-sm text-gray-500">{formData.email}</div>
                                        </div>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${ROLE_COLORS[formData.role] || 'bg-gray-100 text-gray-800'}`}>
                                        {formData.role.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="input-field pl-10"
                                        placeholder="Enter your email or select from sidebar"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="input-field pl-10 pr-10"
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember & Forgot */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Remember me</span>
                                </label>
                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-blue-600 hover:text-blue-500"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full btn-primary py-3 text-base font-medium"
                            >
                                {isLoading ? 'Signing in...' : 'Sign in to Dashboard'}
                            </button>
                        </form>

                        {/* Sign Up Link */}
                        <div className="mt-8 text-center">
                            <p className="text-gray-600">
                                Don't have an account?{' '}
                                <Link
                                    to="/register"
                                    className="font-medium text-blue-600 hover:text-blue-500"
                                >
                                    Sign up as patient
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center text-gray-500 text-sm">
                        <p>© 2024 Hospital Management System. All rights reserved.</p>
                        <p className="mt-1">Secure login powered by advanced encryption</p>
                        <div className="mt-4 text-xs text-gray-400">
                            <p>Development Mode: {QUICK_USERS.length} test users available</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;