import axios from 'axios';

const api = axios.create({
    baseURL: 'https://ript1307-03-2026-nhom11-kthp-1.onrender.com/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
