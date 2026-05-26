import api from '../api';

export async function guiDonMuonThietBi(data: any) {
    return api.post('/yeu-cau-muon', data);
}