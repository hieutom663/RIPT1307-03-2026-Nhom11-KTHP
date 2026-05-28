import api from '../api';

export interface DanhMuc {
    ma_danh_muc: string;
    ten_danh_muc: string;
    mo_ta: string;
    trang_thai: string;
    so_luong_thiet_bi?: number;
}

// GET /api/admin/danh-muc
export async function getDanhSachDanhMucAPI(trangThai?: string) {
    return api.get('/admin/danh-muc', {
        params: trangThai && trangThai !== 'tat-ca' ? { trangThai } : {},
    });
}

// POST /api/admin/danh-muc
export async function themDanhMucAPI(data: {
    ten_danh_muc: string;
    mo_ta: string;
    trang_thai: string;
}) {
    return api.post('/admin/danh-muc', data);
}

// PUT /api/admin/danh-muc/:id
export async function capNhatDanhMucAPI(
    id: string,
    data: { ten_danh_muc: string; mo_ta: string; trang_thai: string }
) {
    return api.put(`/admin/danh-muc/${id}`, data);
}

// DELETE /api/admin/danh-muc/:id
export async function xoaDanhMucAPI(id: string) {
    return api.delete(`/admin/danh-muc/${id}`);
}
