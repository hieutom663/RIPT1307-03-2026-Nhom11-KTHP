import apiClient from '../api';

export async function guiDonMuonThietBi(data: any) {
    return apiClient.post('/yeu-cau-muon', data);
}