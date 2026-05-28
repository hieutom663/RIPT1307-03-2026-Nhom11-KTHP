import apiClient from '../api';

// Lấy danh sách thiết bị (admin)
export async function layDanhSachThietBiAdmin(page: any, limit: any) {
    return apiClient.get('/admin/thiet-bi', { params: { page, limit } });
}

// Thêm thiết bị mới
export async function themThietBiAPI(duLieu: any) {
    return apiClient.post('/admin/thiet-bi', duLieu);
}

// Sửa thiết bị
export async function suaThietBiAPI(id: any, duLieu: any) {
    return apiClient.put('/admin/thiet-bi/' + id, duLieu);
}

// Xóa thiết bị
export async function xoaThietBiAPI(id: any) {
    return apiClient.delete('/admin/thiet-bi/' + id);
}
