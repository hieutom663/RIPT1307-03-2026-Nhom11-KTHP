import api from '../api';

// Lấy danh sách tất cả người dùng
export async function getDanhSachNguoiDungAPI() {
    return api.get('/admin/nguoi-dung');
}

// Xem chi tiết 1 người dùng
export async function getChiTietNguoiDungAPI(maSV: string) {
    return api.get('/admin/nguoi-dung/' + maSV);
}

// Thêm người dùng mới
export async function themNguoiDungAPI(duLieu: {
    ma_sv: string;
    ho_ten: string;
    email: string;
    so_phone?: string;
    mat_khau: string;
    vai_tro?: string;
}) {
    return api.post('/admin/nguoi-dung', duLieu);
}

// Sửa thông tin người dùng
export async function suaNguoiDungAPI(maSV: string, duLieu: {
    ho_ten: string;
    email: string;
    so_phone?: string;
    vai_tro?: string;
}) {
    return api.put('/admin/nguoi-dung/' + maSV, duLieu);
}

// Xóa người dùng
export async function xoaNguoiDungAPI(maSV: string) {
    return api.delete('/admin/nguoi-dung/' + maSV);
}
