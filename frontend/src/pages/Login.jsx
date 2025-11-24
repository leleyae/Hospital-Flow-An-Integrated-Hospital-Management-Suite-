import React, { useState } from 'react';
import { FaLock, FaUserAlt, FaSpinner, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useUser from '../zustand/useUser';
import axios from 'axios';
import duka from '../assets/duka.png';

const LoginPage = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useUser();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!phoneNumber || !password) {
            setError('Please fill in all fields');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post('/api/auth/login', { phone: phoneNumber, password });

            if (response.status === 200) {
                setUser(response.data.data.user);
                switch (response.data.data.user.role) {
                    case 'admin':
                        navigate('/admin/projects');
                        break;
                    case 'hr':
                        navigate('/hr/user');
                        break;
                    case 'storemanager':
                        navigate('/storekeeper/inventory');
                        break;
                    case 'manager':
                        navigate('/manager/projects');
                        break;

                    default:
                        navigate('/');
                }
            } else {
                setError('Invalid phone number or password');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'An error occurred during login');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md md:max-w-lg lg:max-w-xl bg-white rounded-xl shadow-lg p-6 md:p-8 lg:p-10 border border-gray-200">
                {/* Company Logo - Responsive sizing */}
                <div className="flex flex-col items-center mb-8">
                    <div className=" h-20   flex items-center justify-center mb-4">
                        <img src={duka} alt="Duka International School Logo" className="w-full h-full object-contain" />
                    </div>
                    {/* <h1 className="text-xl md:text-2xl orbitron lg:text-3xl font-bold text-gray-900 mb-1">Staff Portal</h1> */}
                    <p className="text-lg md:text-base text-gray-600 text-center">
                        Access your management dashboard
                    </p>
                </div>

                {/* Login Form */}
                <div className="space-y-6">
                    {error && (
                        <div className="rounded-md md:mx-16 bg-red-50 p-3 border border-red-200">
                            <p className="text-lg font-medium text-red-800">{error}</p>
                        </div>
                    )}

                    <form className="space-y-4 md:px-16" onSubmit={handleLogin}>
                        {/* Phone Number Field */}
                        <div>
                            <label htmlFor="phoneNumber" className="block text-lg font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="text"
                                    autoComplete="tel"
                                    required
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    disabled={isLoading}
                                    className="focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 block w-full pr-10 text-lg border-gray-300 border rounded-lg p-3 pl-4"
                                    placeholder="Enter your phone number"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <FaUserAlt className="h-4 w-4 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                    className="focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white block w-full pr-10 text-lg border-gray-300 border rounded-lg p-3 pl-4"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? (
                                        <FaEyeSlash className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                                    ) : (
                                        <FaEye className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className='pt-2'>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-lg md:text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-md"
                            >
                                {isLoading ? (
                                    <>
                                        <FaSpinner className="animate-spin mr-2 h-5 w-5" />
                                        Loading...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="text-center text-lg text-gray-500 mt-6">
                        <p>© {new Date().getFullYear()} Intel Motion. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;