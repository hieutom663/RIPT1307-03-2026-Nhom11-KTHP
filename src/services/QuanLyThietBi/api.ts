import api from '../api';

// Lấy danh sách thiết bị (admin)
export async function getDanhSachThietBiAdminAPI(params: { page: any; limit: any; danhMuc?: any; tuKhoa?: any }) {
    return api.get('/admin/thiet-bi', { params });
}

// Thêm
export async function themThietBiAPI(duLieu: any) {
    return api.post('/admin/thiet-bi', duLieu);
}

// Sửa
export async function suaThietBiAPI(id: any, duLieu: any) {
    return api.put('/admin/thiet-bi/' + id, duLieu);
}

// Xóa
export async function xoaThietBiAPI(id: any) {
    return api.delete('/admin/thiet-bi/' + id);
}