import api from '../api';

export async function getDanhSachThietBi(params: { danhMuc: string, tuKhoa:string, page: number, limit: number }) {
    return api.get('/thiet-bi', { params });
}

export async function getDanhSachDanhMuc() {
    return api.get('/danh-muc');
}

export async function getThietBiPhoBienAPI() {
    return api.get('/thiet-bi/pho-bien'); 
}

export async function getThietBiSanAPI() {
    return api.get('/thiet-bi/co-san');
}