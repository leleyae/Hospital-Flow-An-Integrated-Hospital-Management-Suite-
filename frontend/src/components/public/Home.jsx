// src/pages/public/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import {
    Stethoscope,
    Users,
    Pill,
    Beaker,
    Calendar,
    Clock,
    Shield,
    Star,
    ArrowRight,
    Phone,
    MapPin,
    Mail
} from 'lucide-react';

const PublicHome = () => {
    const features = [
        {
            icon: Stethoscope,
            title: 'Expert Doctors',
            description: 'Board-certified specialists with years of experience'
        },
        {
            icon: Users,
            title: 'Patient Care',
            description: 'Compassionate care with personalized treatment plans'
        },
        {
            icon: Pill,
            title: 'Pharmacy Services',
            description: 'Full-service pharmacy with medication management'
        },
        {
            icon: Beaker,
            title: 'Advanced Labs',
            description: 'State-of-the-art diagnostic laboratory'
        },
        {
            icon: Calendar,
            title: 'Easy Scheduling',
            description: 'Online appointment booking 24/7'
        },
        {
            icon: Shield,
            title: 'Secure Records',
            description: 'HIPAA-compliant electronic health records'
        }
    ];

    const departments = [
        { name: 'Cardiology', doctors: 8 },
        { name: 'Neurology', doctors: 6 },
        { name: 'Pediatrics', doctors: 10 },
        { name: 'Orthopedics', doctors: 7 },
        { name: 'Dermatology', doctors: 5 },
        { name: 'Emergency', doctors: 12 }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold mb-6">
                            Advanced Healthcare at Your Fingertips
                        </h1>
                        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                            Experience world-class medical care with our comprehensive hospital management system.
                            From online appointments to telemedicine, we make healthcare accessible.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                            >
                                Patient Portal
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-400 transition-colors"
                            >
                                Staff Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Why Choose Our Hospital?
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        We combine cutting-edge technology with compassionate care to deliver exceptional healthcare services.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                <feature.icon className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Departments Section */}
            <div className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Our Specialized Departments
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Comprehensive medical care across all major specialties
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {departments.map((dept, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold">{dept.name}</h3>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-lg">
                                        {dept.doctors} Doctors
                                    </span>
                                </div>
                                <div className="flex items-center text-lg text-gray-600">
                                    <Clock className="w-4 h-4 mr-2" />
                                    <span>24/7 Emergency Services Available</span>
                                </div>
                                <button className="mt-4 text-blue-600 hover:text-blue-700 font-medium flex items-center">
                                    View Doctors
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-blue-600 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold mb-2">500+</div>
                            <div className="text-blue-200">Expert Doctors</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">50K+</div>
                            <div className="text-blue-200">Patients Treated</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">24/7</div>
                            <div className="text-blue-200">Emergency Services</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">99%</div>
                            <div className="text-blue-200">Patient Satisfaction</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-white text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                    <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                        Join thousands of patients who trust us with their healthcare needs.
                        Book your first appointment today!
                    </p>
                    <Link
                        to="/login"
                        className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                    >
                        Book Appointment Now
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                                    <Stethoscope className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="font-bold text-lg">Hospital Management</h3>
                                </div>
                            </div>
                            <p className="text-gray-400">
                                Delivering exceptional healthcare through innovative technology and compassionate care.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link to="/" className="hover:text-white">Home</Link></li>
                                <li><Link to="/login" className="hover:text-white">Patient Login</Link></li>
                                <li><Link to="/login" className="hover:text-white">Staff Login</Link></li>
                                <li><Link to="/register" className="hover:text-white">Patient Registration</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4">Departments</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li>Emergency Care</li>
                                <li>Cardiology</li>
                                <li>Neurology</li>
                                <li>Pediatrics</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4">Contact Us</h4>
                            <div className="space-y-3 text-gray-400">
                                <div className="flex items-center">
                                    <MapPin className="w-5 h-5 mr-3" />
                                    <span>123 Medical Street, City, Country</span>
                                </div>
                                <div className="flex items-center">
                                    <Phone className="w-5 h-5 mr-3" />
                                    <span>+1 (234) 567-8900</span>
                                </div>
                                <div className="flex items-center">
                                    <Mail className="w-5 h-5 mr-3" />
                                    <span>info@hospital.com</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>© 2024 Hospital Management System. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicHome;