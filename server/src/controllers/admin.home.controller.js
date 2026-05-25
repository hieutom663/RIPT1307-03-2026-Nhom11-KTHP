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
            pool.query("SELECT COUNT(*) AS total FROM yeucaumuon WHERE trang_thai = 'đang mượn'"),
            
            // Yêu cầu mới
            pool.query("SELECT COUNT(*) AS total FROM yeucaumuon WHERE trang_thai = 'chờ duyệt'"),
            
            // Quá hạn
            pool.query("SELECT COUNT(*) AS total FROM yeucaumuon WHERE trang_thai = 'đang mượn' AND ngay_tra_du_kien < NOW()"),
            
            // Yêu cầu đang chờ duyệt
            pool.query(`
                SELECT 
                    y.id, 
                    u.ten AS tenSinhVien, 
                    GROUP_CONCAT(t.ten SEPARATOR ', ') AS doMuon, 
                    DATE_FORMAT(y.ngay_muon, '%d/%m/%Y') AS ngay
                FROM yeucaumuon y
                JOIN users u ON y.nguoi_muon_id = u.ma_sv
                JOIN chitietdon c ON y.id = c.id_donmuon
                JOIN thietbi t ON c.id_thietbi = t.id
                WHERE y.trang_thai = 'chờ duyệt'
                GROUP BY y.id, u.ten, y.ngay_muon
                ORDER BY y.ngay_muon DESC 
                LIMIT 5
            `),
            
            // Hoạt động gần đây
            pool.query(`
                SELECT 
                    y.id, 
                    u.ten AS tenSinhVien, 
                    GROUP_CONCAT(t.ten SEPARATOR ', ') AS doMuon, 
                    DATE_FORMAT(COALESCE(y.ngay_duyet, y.ngay_muon), '%d/%m/%Y') AS ngay, 
                    y.trang_thai AS trang_thai
                FROM yeucaumuon y
                JOIN users u ON y.nguoi_muon_id = u.ma_sv
                JOIN chitietdon c ON y.id = c.id_donmuon
                JOIN thietbi t ON c.id_thietbi = t.id
                WHERE y.trang_thai IN ('Đang muợn', 'Hoàn thành', 'Bị từ chối')
                GROUP BY y.id, u.ten, y.ngay_duyet, y.ngay_muon, y.trang_thai
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