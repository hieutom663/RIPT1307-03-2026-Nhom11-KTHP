import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';

interface LoginResponse {
    success: boolean;
    message: string;
    token?: string;
    user?: any;
}

export const loginAPI = async (email: string, password: string): Promise<LoginResponse> => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || new Error('Lỗi kết nối đến Server');
    }
};