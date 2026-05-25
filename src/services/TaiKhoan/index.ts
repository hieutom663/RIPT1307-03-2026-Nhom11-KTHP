import api from "../api";

interface LoginResponse {
    success: boolean;
    message: string;
    token?: string;
    user?: any;
}

export const loginAPI = async (email: string, password: string): Promise<LoginResponse> => {
    try {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || new Error('Lỗi kết nối đến Server');
    }
};