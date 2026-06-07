import api from '../api';

export async function getDanhSachThietBiAPI(params: { danhMuc: string, tuKhoa:string, page: number, limit: number }) {
    return api.get('/thiet-bi', { params });
}

export async function getDanhSachDanhMucAPI() {
    return api.get('/danh-muc');
}

export async function getThietBiPhoBienAPI() {
    return api.get('/thiet-bi/pho-bien'); 
}

export async function getThietBiSanAPI() {
    return api.get('/thiet-bi/co-san');
}