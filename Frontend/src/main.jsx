import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.jsx';
import { BookingProvider } from './context/BookingContext.jsx';

// Global Axios Interceptor for Auth Token
axios.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('luxeride_user'));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <BookingProvider>
                <App />
            </BookingProvider>
        </AuthProvider>
    </React.StrictMode>
);
