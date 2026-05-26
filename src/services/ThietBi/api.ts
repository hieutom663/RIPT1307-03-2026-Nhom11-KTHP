import apiClient from '../api';

export async function getDanhSachThietBi(params: { danhMuc: string, tuKhoa:string, page: number, limit: number }) {
    return apiClient.get('/thiet-bi', { params });
}

export async function getDanhSachDanhMuc() {
    return apiClient.get('/danh-muc');
}

export async function getThietBiPhoBienAPI() {
    return apiClient.get('/thiet-bi/pho-bien'); 
}

export async function getThietBiSanAPI() {
    return apiClient.get('/thiet-bi/co-san');
}