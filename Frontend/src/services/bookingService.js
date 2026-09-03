import axios from 'axios';

const API_URL = '/api/bookings/';

// Assume token is attached via interceptor conceptually
export const getMyBookings = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get(API_URL + 'mybookings', config);
    return res.data;
};

export const createBooking = async (bookingData, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.post(API_URL, bookingData, config);
    return res.data;
};
