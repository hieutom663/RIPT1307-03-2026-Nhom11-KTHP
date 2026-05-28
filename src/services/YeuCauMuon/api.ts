import api from '../api';

// Lấy danh sách yêu cầu mượn (admin)
export async function getDanhSachYeuCauAPI() {
    return api.get('/admin/yeu-cau-muon');
}

// Duyệt yêu cầu mượn
export async function duyetYeuCauAPI(maYC: string) {
    return api.put(`/admin/yeu-cau-muon/${maYC}/duyet`);
}

// Từ chối yêu cầu mượn
export async function tuChoiYeuCauAPI(maYC: string) {
    return api.put(`/admin/yeu-cau-muon/${maYC}/tu-choi`);
}

// Gửi đơn mượn thiết bị (user)
export async function guiDonMuonThietBi(data: any) {
    return api.post('/yeu-cau-muon', data);
}