import axios from 'axios';

const API_URL = '/api/auth/';

export const login = async (email, password) => {
    const res = await axios.post(API_URL + 'login', { email, password });
    if (res.data) localStorage.setItem('user', JSON.stringify(res.data));
    return res.data;
};

export const register = async (name, email, password) => {
    const res = await axios.post(API_URL + 'register', { name, email, password });
    if (res.data) localStorage.setItem('user', JSON.stringify(res.data));
    return res.data;
};

export const logout = () => {
    localStorage.removeItem('user');
};
