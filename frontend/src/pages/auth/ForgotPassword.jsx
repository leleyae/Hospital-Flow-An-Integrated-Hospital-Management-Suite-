// src/pages/auth/ForgotPassword.js
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setSubmitted(true);
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Back Button */}
                <Link
                    to="/login"
                    className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                </Link>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {!submitted ? (
                        <>
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Mail className="w-8 h-8 text-blue-600" />
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900">Forgot Password?</h1>
                                <p className="text-gray-600 mt-2">
                                    Enter your email address and well send you instructions to reset your password.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="input-field pl-10"
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full btn-primary py-3 text-base font-medium"
                                >
                                    {isLoading ? 'Sending...' : 'Send Reset Instructions'}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email</h1>
                            <p className="text-gray-600 mb-6">
                                Weve sent password reset instructions to{' '}
                                <span className="font-semibold">{email}</span>.
                            </p>
                            <div className="space-y-3">
                                <Link
                                    to="/login"
                                    className="block w-full btn-primary py-3 text-base font-medium"
                                >
                                    Return to Login
                                </Link>
                                <p className="text-lg text-gray-500">
                                    Didnt receive the email?{' '}
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="text-blue-600 hover:text-blue-500 font-medium"
                                    >
                                        Click to resend
                                    </button>
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Support Info */}
                    <div className="mt-8 pt-8 border-t border-gray-200">
                        <p className="text-center text-lg text-gray-600">
                            Need help? Contact our support team at{' '}
                            <a href="mailto:support@hospital.com" className="text-blue-600 hover:text-blue-500">
                                support@hospital.com
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;