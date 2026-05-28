const pool = require('../config/db.config');

const getAdminHome = async (req, res) => {
    try {
        const [
            [totalEquipments],
            [borrowedEquipments],
            [pendingRequests],
            [overdueRequests],
            [pendingList],
            [recentActivities]
        ] = await Promise.all([
            // Tổng đồ dùng
            pool.query("SELECT SUM(tong_so_luong) AS total FROM thietbi"),
            
            // Đang cho mượn
            pool.query("SELECT COUNT(*) AS total FROM yeucaumuon WHERE trang_thai = 'Đang mượn'"),
            
            // Yêu cầu mới
            pool.query("SELECT COUNT(*) AS total FROM yeucaumuon WHERE trang_thai = 'Chờ duyệt'"),
            
            // Quá hạn
            pool.query("SELECT COUNT(*) AS total FROM yeucaumuon WHERE trang_thai = 'Đang mượn' AND ngay_tra_du_kien < NOW()"),
            
            // Đang chờ duyệt
            pool.query(`
            SELECT 
                y.ma_yeu_cau AS id, 
                u.ho_ten AS tenSinhVien, 
                GROUP_CONCAT(t.ten_thiet_bi SEPARATOR ', ') AS doMuon, 
                DATE_FORMAT(y.ngay_muon, '%d/%m/%Y') AS ngay
            FROM yeucaumuon y
            JOIN users u ON y.ma_nguoi_muon = u.ma_sv
            JOIN chitietdon c ON y.ma_yeu_cau = c.ma_yeu_cau
            JOIN thietbi t ON c.ma_thiet_bi = t.ma_thiet_bi
            WHERE y.trang_thai = 'Chờ duyệt'
            GROUP BY y.ma_yeu_cau, u.ho_ten, y.ngay_muon
            ORDER BY y.ngay_muon DESC 
            LIMIT 5
            `),
            
            pool.query(`
                SELECT 
                    y.ma_yeu_cau AS id, 
                    u.ho_ten AS tenSinhVien, 
                    GROUP_CONCAT(t.ten_thiet_bi SEPARATOR ', ') AS doMuon, 
                    DATE_FORMAT(COALESCE(y.ngay_duyet, y.ngay_muon), '%d/%m/%Y') AS ngay, 
                    y.trang_thai AS trang_thai
                FROM yeucaumuon y
                JOIN users u ON y.ma_nguoi_muon = u.ma_sv
                JOIN chitietdon c ON y.ma_yeu_cau = c.ma_yeu_cau
                JOIN thietbi t ON c.ma_thiet_bi = t.ma_thiet_bi
                WHERE y.trang_thai IN ('Đang mượn', 'Hoàn thành', 'Bị từ chối')
                GROUP BY y.ma_yeu_cau, u.ho_ten, y.ngay_duyet, y.ngay_muon, y.trang_thai
                ORDER BY COALESCE(y.ngay_duyet, y.ngay_muon) DESC 
                LIMIT 5
            `)
        ]);

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    // base
                    totalEquipments: totalEquipments[0].total || 0,
                    borrowedEquipments: borrowedEquipments[0].total || 0,
                    pendingRequests: pendingRequests[0].total || 0,
                    overdueRequests: overdueRequests[0].total || 0
                },
                pendingList: pendingList,
                recentActivities: recentActivities
            }
        });

    } catch (error) {
        console.error("Lỗi:", error);
        res.status(500).json({ 
            success: false, 
            message: "Lỗi server khi tải dữ liệu trang chủ" 
        });
    }
};

module.exports = {
    getAdminHome
};