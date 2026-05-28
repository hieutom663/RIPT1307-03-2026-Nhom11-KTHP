import apiClient from '../api';

// Lấy danh sách chờ giao thiết bị
export async function layDanhSachChoGiaoAPI() {
    return apiClient.get('/admin/lich-su/cho-giao');
}

// Lấy danh sách đang mượn
export async function layDanhSachDangMuonAPI() {
    return apiClient.get('/admin/lich-su/dang-muon');
}

// Ghi nhận cho mượn
export async function ghiNhanChoMuonAPI(maYC: any) {
    return apiClient.put('/admin/lich-su/cho-muon/' + maYC);
}

// Ghi nhận đã trả
export async function ghiNhanDaTraAPI(maYC: any) {
    return apiClient.put('/admin/lich-su/da-tra/' + maYC);
}
