import api from '../api';

// Lấy danh sách thông báo Admin
export async function getDanhSachThongBaoAdminAPI() {
    return api.get('/thong-bao/admin'); 
}

export async function danhDauDaDocAPI(id: string | number) {
    return api.put(`/thong-bao/admin/${id}/da-doc`);
}

export async function danhDauDocTatCaAPI() {
    return api.put('/thong-bao/admin/doc-tat-ca');
}

// User
export async function getDanhSachThongBaoUserAPI(maSV: string) {
    return api.get(`/thong-bao/user?maSV=${maSV}`); 
}

export async function danhDauDocTatCaUserAPI(maSV: string) {
    return api.put('/thong-bao/user/doc-tat-ca', { maSV }); 
}