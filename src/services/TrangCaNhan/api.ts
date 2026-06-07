import api from '../api';

export const getTrangCaNhanAPI = async (ma_sv: string) => {
    return api.post('/user/trang-ca-nhan', { ma_sv });
};

export const updateTrangCaNhanAPI = async (data: any) => {
    return api.post('/user/update', data);
};

export const changePasswordAPI = async (data: { ma_sv: string; matKhauCu: string; matKhauMoi: string }) => {
    return api.post('/user/change-password', data);
};