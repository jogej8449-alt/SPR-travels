import axios from 'axios';

const API_URL = '/api/cars/';

export const getCars = async () => {
    const res = await axios.get(API_URL);
    return res.data;
};

export const getCarById = async (id) => {
    const res = await axios.get(API_URL + id);
    return res.data;
};
