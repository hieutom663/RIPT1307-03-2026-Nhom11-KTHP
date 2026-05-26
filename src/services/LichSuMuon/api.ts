import api from '../api';

export async function getThongKeCaNhanAPI(ma_sv: string) {
    return api.post('/lich-su-muon/thong-ke', { ma_sv }); 
}

export async function getPhieuMuonAPI(ma_sv: string) {
    return api.post('/lich-su-muon/phieu-muon', { ma_sv });
}

export async function getChiTietLichSuAPI(ma_sv: string) {
    return api.post('/lich-su-muon/chi-tiet', { ma_sv });
}