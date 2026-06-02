import api from '../api';

// Lấy danh sách thông báo Admin
export async function getDanhSachThongBaoAdminAPI() {
    return api.get('/admin/thong-bao'); 
}

export async function danhDauDaDocAPI(id: string | number) {
    return api.put(`/admin/thong-bao/${id}/da-doc`);
}

export async function danhDauDocTatCaAPI() {
    return api.put('/admin/thong-bao/doc-tat-ca');
}

//user
export async function getDanhSachThongBaoUserAPI(maSV: string) {
    return api.get(`/admin/thong-bao/user?maSV=${maSV}`); 
}

export async function danhDauDocTatCaUserAPI(maSV: string) {
    return api.put('/admin/thong-bao/user/doc-tat-ca', { maSV }); 
}