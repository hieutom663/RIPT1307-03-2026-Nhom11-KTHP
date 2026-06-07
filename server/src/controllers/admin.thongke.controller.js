const pool = require('../config/db.config');

/**
 * Lấy thống kê tổng quan hệ thống
 * GET /api/admin/thong-ke/tong-quan
 */
const getThongKeTongQuan = async (req, res) => {
    try {
        const [
            [tongThietBi],
            [tongYeuCau],
            [choDuyet],
            [dangMuon],
            [quaHan],
            [daHoanThanh]
        ] = await Promise.all([
            // Tổng thiết bị (số loại thiết bị)
            pool.query("SELECT COUNT(*) AS total FROM thietbi"),

            // Tổng yêu cầu
            pool.query("SELECT COUNT(*) AS total FROM yeucaumuon"),

            // Chờ duyệt
            pool.query("SELECT COUNT(*) AS total FROM yeucaumuon WHERE trang_thai = 'Chờ duyệt'"),

            // Đang mượn
            pool.query("SELECT COUNT(*) AS total FROM yeucaumuon WHERE trang_thai = 'Đang mượn'"),

            // Quá hạn (đang mượn và quá ngày trả dự kiến)
            pool.query("SELECT COUNT(*) AS total FROM yeucaumuon WHERE trang_thai = 'Đang mượn' AND ngay_tra_du_kien < CURDATE()"),

            // Đã hoàn thành
            pool.query("SELECT COUNT(*) AS total FROM yeucaumuon WHERE trang_thai = 'Hoàn thành'")
        ]);

        res.json({
            success: true,
            data: {
                tongThietBi: tongThietBi[0].total || 0,
                tongYeuCau: tongYeuCau[0].total || 0,
                choDuyet: choDuyet[0].total || 0,
                dangMuon: dangMuon[0].total || 0,
                quaHan: quaHan[0].total || 0,
                daHoanThanh: daHoanThanh[0].total || 0
            }
        });

    } catch (error) {
        console.error("Lỗi getThongKeTongQuan:", error);
        res.status(500).json({ success: false, message: "Lỗi server khi lấy thống kê tổng quan" });
    }
};

/**
 * Lấy top thiết bị mượn nhiều nhất
 * GET /api/admin/thong-ke/top-thiet-bi
 */
const getTopThietBi = async (req, res) => {
    try {
        const queryStr = `
            SELECT 
                t.ma_thiet_bi,
                t.ten_thiet_bi AS ten,
                d.ten_danh_muc AS danhMuc,
                COALESCE(SUM(c.so_luong), 0) AS luot
            FROM thietbi t
            LEFT JOIN danhmuc d ON t.ma_danh_muc = d.ma_danh_muc
            LEFT JOIN chitietdon c ON t.ma_thiet_bi = c.ma_thiet_bi
            GROUP BY t.ma_thiet_bi, t.ten_thiet_bi, d.ten_danh_muc
            ORDER BY luot DESC, t.ten_thiet_bi ASC
        `;

        const [rows] = await pool.query(queryStr);

        const data = rows.map((row, index) => {
            let medal = '';
            if (index === 0) medal = '🥇';
            else if (index === 1) medal = '🥈';
            else if (index === 2) medal = '🥉';

            return {
                key: String(index + 1),
                rank: index + 1,
                ten: row.ten,
                danhMuc: row.danhMuc || 'Chưa phân loại',
                luot: Number(row.luot) || 0,
                medal
            };
        });

        res.json({ success: true, data });

    } catch (error) {
        console.error("Lỗi getTopThietBi:", error);
        res.status(500).json({ success: false, message: "Lỗi server khi lấy top thiết bị" });
    }
};

/**
 * Lấy phân bố trạng thái yêu cầu
 * GET /api/admin/thong-ke/phan-bo-trang-thai
 */
const getPhanBoTrangThai = async (req, res) => {
    try {
        // Đếm từng trạng thái
        const [
            [choDuyet],
            [daDuyet],
            [dangMuon],
            [daTra],
            [tuChoi],
            [quaHan],
            [tongCong]
        ] = await Promise.all([
            pool.query("SELECT COUNT(*) AS count FROM yeucaumuon WHERE trang_thai = 'Chờ duyệt'"),
            pool.query("SELECT COUNT(*) AS count FROM yeucaumuon WHERE trang_thai = 'Đã duyệt'"),
            pool.query("SELECT COUNT(*) AS count FROM yeucaumuon WHERE trang_thai = 'Đang mượn' AND ngay_tra_du_kien >= CURDATE()"),
            pool.query("SELECT COUNT(*) AS count FROM yeucaumuon WHERE trang_thai = 'Hoàn thành'"),
            pool.query("SELECT COUNT(*) AS count FROM yeucaumuon WHERE trang_thai = 'Bị từ chối'"),
            pool.query("SELECT COUNT(*) AS count FROM yeucaumuon WHERE trang_thai = 'Đang mượn' AND ngay_tra_du_kien < CURDATE()"),
            pool.query("SELECT COUNT(*) AS total FROM yeucaumuon")
        ]);

        const total = tongCong[0].total || 1; // tránh chia 0

        const calcPct = (count) => Math.round((count / total) * 100);

        const data = [
            { label: 'Chờ duyệt', color: '#fa8c16', bg: '#fff7e6', count: choDuyet[0].count || 0, pct: calcPct(choDuyet[0].count || 0) },
            { label: 'Đã duyệt', color: '#1677ff', bg: '#e6f4ff', count: daDuyet[0].count || 0, pct: calcPct(daDuyet[0].count || 0) },
            { label: 'Đang mượn', color: '#52c41a', bg: '#f6ffed', count: dangMuon[0].count || 0, pct: calcPct(dangMuon[0].count || 0) },
            { label: 'Đã trả', color: '#8c8c8c', bg: '#fafafa', count: daTra[0].count || 0, pct: calcPct(daTra[0].count || 0) },
            { label: 'Từ chối', color: '#ff4d4f', bg: '#fff1f0', count: tuChoi[0].count || 0, pct: calcPct(tuChoi[0].count || 0) },
            { label: 'Quá hạn', color: '#f5222d', bg: '#fff1f0', count: quaHan[0].count || 0, pct: calcPct(quaHan[0].count || 0) },
        ];

        res.json({ success: true, data });

    } catch (error) {
        console.error("Lỗi getPhanBoTrangThai:", error);
        res.status(500).json({ success: false, message: "Lỗi server khi lấy phân bố trạng thái" });
    }
};

module.exports = { getThongKeTongQuan, getTopThietBi, getPhanBoTrangThai };
