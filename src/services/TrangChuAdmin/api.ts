import api from '../api';

export async function getAdminHomeDataAPI() {
    return api.get('/admin/trang-chu');
}