import api from '../api';

// Lấy thống kê tổng quan hệ thống
export async function getThongKeTongQuanAPI() {
    return api.get('/admin/thong-ke/tong-quan');
}

// Lấy top thiết bị mượn nhiều
export async function getTopThietBiAPI() {
    return api.get('/admin/thong-ke/top-thiet-bi');
}

// Lấy phân bố trạng thái yêu cầu
export async function getPhanBoTrangThaiAPI() {
    return api.get('/admin/thong-ke/phan-bo-trang-thai');
}
