import { useState, useEffect } from 'react';
import { getDanhSachDanhMucAPI } from '@/services/ThietBi/api';

export default function useDanhMucModel() {
    const [danhSachDanhMuc, setDanhSachDanhMuc] = useState<any[]>([]);
    
    const fetchDanhMuc = async (force = false) => {
        if (!force && danhSachDanhMuc.length > 0) return; 

        try {
            const response = await getDanhSachDanhMucAPI();
            if (response.data.success) {
                setDanhSachDanhMuc(response.data.data);
            }
        } catch (error) {
            console.error("Lỗi lấy danh mục:", error);
        }
    };

    const refresh = () => fetchDanhMuc(true);

    useEffect(() => {
        fetchDanhMuc();
    }, []);

    return {
        danhSachDanhMuc,
        fetchDanhMuc,
        refresh, 
    };
}