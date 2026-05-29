import api from '../api';

export async function getLichSuAdminAPI() {
    return api.post('/admin/lich-su-muon/thong-ke'); 
}

export async function getAllPhieuMuonAPI() {
    return api.post('/admin/lich-su-muon/phieu-muon');
}

export async function getChiTietLichSuAPI() {
    return api.post('/admin/lich-su-muon/chi-tiet');
}