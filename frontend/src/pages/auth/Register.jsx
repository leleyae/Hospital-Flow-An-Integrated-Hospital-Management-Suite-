// src/pages/auth/Register.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, Calendar, MapPin, Eye, EyeOff, Pill } from 'lucide-react';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        address: '',
        password: '',
        confirmPassword: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle registration
        console.log(formData);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="md:flex">
                        {/* Left Side - Form */}
                        <div className="md:w-2/3 p-8">
                            <div className="text-center mb-8">
                                <h1 className="text-2xl font-bold text-gray-900">Create Patient Account</h1>
                                <p className="text-gray-600 mt-2">Register for access to our healthcare services</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-lg font-medium text-gray-700 mb-2">
                                            First Name
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                className="input-field pl-10"
                                                placeholder="John"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-lg font-medium text-gray-700 mb-2">
                                            Last Name
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                className="input-field pl-10"
                                                placeholder="Doe"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-2">
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
                                            placeholder="john@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="input-field pl-10"
                                            placeholder="+1 (234) 567-8900"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-lg font-medium text-gray-700 mb-2">
                                            Date of Birth
                                        </label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="date"
                                                name="dateOfBirth"
                                                value={formData.dateOfBirth}
                                                onChange={handleChange}
                                                className="input-field pl-10"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-lg font-medium text-gray-700 mb-2">
                                            Address
                                        </label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                className="input-field pl-10"
                                                placeholder="City, State"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-lg font-medium text-gray-700 mb-2">
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
                                                placeholder="••••••••"
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

                                    <div>
                                        <label className="block text-lg font-medium text-gray-700 mb-2">
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                className="input-field pl-10"
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        required
                                    />
                                    <label htmlFor="terms" className="ml-2 text-lg text-gray-700">
                                        I agree to the{' '}
                                        <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                                            Terms of Service
                                        </Link>{' '}
                                        and{' '}
                                        <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
                                            Privacy Policy
                                        </Link>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full btn-primary py-3 text-base font-medium"
                                >
                                    Create Account
                                </button>
                            </form>

                            <div className="mt-6 text-center">
                                <p className="text-gray-600">
                                    Already have an account?{' '}
                                    <Link
                                        to="/login"
                                        className="font-medium text-blue-600 hover:text-blue-500"
                                    >
                                        Sign in here
                                    </Link>
                                </p>
                            </div>
                        </div>

                        {/* Right Side - Info */}
                        <div className="md:w-1/2 bg-gradient-to-b from-blue-600 to-blue-700 p-8 text-white">
                            <div className="h-full flex flex-col justify-center">
                                <h2 className="text-2xl font-bold mb-6">Benefits of Registration</h2>
                                <ul className="space-y-4">
                                    <li className="flex items-start">
                                        <div className="bg-white/20 p-2 rounded-lg mr-3">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">Online Appointments</h3>
                                            <p className="text-blue-100 text-lg">Book appointments 24/7</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start">

                                        <div>
                                            <h3 className="font-semibold">Medical Records</h3>
                                            <p className="text-blue-100 text-lg">Access health history online</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="bg-white/20 p-2 rounded-lg mr-3">
                                            <Pill className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">Prescriptions</h3>
                                            <p className="text-blue-100 text-lg">View and refill medications</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start">

                                        <div>
                                            <h3 className="font-semibold">Telemedicine</h3>
                                            <p className="text-blue-100 text-lg">Virtual consultations</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};



export default Register;