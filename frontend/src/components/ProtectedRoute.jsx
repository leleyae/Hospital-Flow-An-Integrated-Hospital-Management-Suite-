// src/components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../config/api';

const API_BASE_URL = 'http://localhost:5000/api';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await api.get(`${API_BASE_URL}/auth/check-auth`, {
                    withCredentials: true
                });

                if (response.data.status === 'success') {
                    setIsAuthenticated(true);
                    setUserRole(response.data.data.user.role);

                    // Check if user has required role
                    if (allowedRoles.length > 0 && !allowedRoles.includes(response.data.data.user.role)) {
                        setIsAuthenticated(false);
                    }
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [allowedRoles]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;