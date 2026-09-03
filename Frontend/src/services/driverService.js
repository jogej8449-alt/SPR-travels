import axios from 'axios';

const API_URL = '/api/drivers/';

export const getDrivers = async () => {
    const res = await axios.get(API_URL);
    return res.data;
};
