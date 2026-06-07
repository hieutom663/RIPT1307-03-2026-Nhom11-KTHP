import api from '../api';

export async function getLichSuAdminAPI() {
    return api.post('/admin/lich-su/thong-ke'); 
}

export async function getAllPhieuMuonAPI() {
    return api.post('/admin/lich-su/phieu-muon');
}

export async function getChiTietLichSuAPI() {
    return api.post('/admin/lich-su/chi-tiet');
}