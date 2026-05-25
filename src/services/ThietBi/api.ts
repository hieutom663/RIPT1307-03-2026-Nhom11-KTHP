import apiClient from '../api';

export async function getDanhSachThietBi(params: { danhMuc: string, tuKhoa:string, page: number, limit: number }) {
    return apiClient.get('/thiet-bi', { params });
}

export async function getDanhSachDanhMuc() {
    return apiClient.get('/danh-muc');
}