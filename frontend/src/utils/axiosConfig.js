// src/utils/axiosConfig.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle responses
axiosInstance.interceptors.response.use(
    (response) => response.data,
    (error) => {

        return Promise.reject(error.response?.data || error.message);
    }
);

export default axiosInstance;