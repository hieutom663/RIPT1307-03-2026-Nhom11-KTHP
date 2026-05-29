const pool = require('../config/db.config');

const getThongKeCaNhan = async (req, res) => {
    try {

        const ma_sv = req.body.ma_sv;
        
        if (!ma_sv) return res.json({ success: false, message: "Thiếu mã sinh viên" });

        const [[{ choXuLy }]] = await pool.query(
            `SELECT COUNT(*) AS choXuLy FROM yeucaumuon WHERE ma_nguoi_muon = ? AND trang_thai = 'Chờ duyệt'`, 
            [ma_sv]
        );

        const [[{ dangMuon, quaHan, daTra }]] = await pool.query(
            `SELECT 
                SUM(CASE WHEN c.trang_thai = 'Chưa trả' AND y.ngay_tra_du_kien >= CURDATE() THEN 1 ELSE 0 END) AS dangMuon,
                SUM(CASE WHEN c.trang_thai = 'Chưa trả' AND y.ngay_tra_du_kien < CURDATE() THEN 1 ELSE 0 END) AS quaHan,
                SUM(CASE WHEN c.trang_thai = 'Đã trả' THEN 1 ELSE 0 END) AS daTra
            FROM chitietdon c
            JOIN yeucaumuon y ON c.ma_yeu_cau = y.ma_yeu_cau
            WHERE y.ma_nguoi_muon = ?`,
            [ma_sv]
        );

        res.json({
            success: true,
            data: {
                choXuLy: Number(choXuLy) || 0,
                dangMuon: Number(dangMuon) || 0,
                quaHan: Number(quaHan) || 0,
                daTra: Number(daTra) || 0
            }
        });
    } catch (error) {
        console.error("Lỗi getThongKeCaNhan:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

const getPhieuMuon = async (req, res) => {
    try {
        const ma_sv = req.body.ma_sv;
        
        if (!ma_sv) return res.json({ success: false, message: "Thiếu mã sinh viên" });

        const queryStr = `
            SELECT 
                ma_yeu_cau AS maYeuCau,
                DATE_FORMAT(ngay_muon, '%Y-%m-%d') AS ngayTao,
                DATE_FORMAT(ngay_tra_du_kien, '%Y-%m-%d') AS ngayTraDuKien,
                ly_do_muon AS lyDo,
                trang_thai AS trangThai
            FROM yeucaumuon
            WHERE ma_nguoi_muon = ?
            ORDER BY ngay_muon DESC, ma_yeu_cau DESC
        `;
        const [rows] = await pool.query(queryStr, [ma_sv]);
        
        const dataWithKey = rows.map((row) => ({ ...row, key: row.maYeuCau }));
        
        res.json({ success: true, data: dataWithKey });
    } catch (error) {
        console.error("Lỗi getPhieuMuon:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

const getChiTietLichSu = async (req, res) => {
    try {
        const ma_sv = req.body.ma_sv;
        
        if (!ma_sv) return res.json({ success: false, message: "Thiếu mã sinh viên" });

        const queryStr = `
            SELECT 
                c.ma_yeu_cau AS maPhieu,
                c.ma_thiet_bi AS maDoDung,
                t.ten_thiet_bi AS tenDoDung,
                c.so_luong AS soLuong,
                DATE_FORMAT(y.ngay_tra_du_kien, '%Y-%m-%d') AS hanTra,
                CASE 
                    WHEN c.trang_thai = 'Đã trả' THEN 'Đã trả'
                    WHEN y.ngay_tra_du_kien < CURDATE() THEN 'Quá hạn'
                    ELSE 'Chưa trả'
                END AS trangThai
            FROM chitietdon c
            JOIN yeucaumuon y ON c.ma_yeu_cau = y.ma_yeu_cau
            JOIN thietbi t ON c.ma_thiet_bi = t.ma_thiet_bi
            WHERE y.ma_nguoi_muon = ?
            ORDER BY y.ngay_muon DESC, c.ma_don_muon DESC
        `;
        const [rows] = await pool.query(queryStr, [ma_sv]);

        const dataWithKey = rows.map((row) => ({ ...row, key: `${row.maPhieu}_${row.maDoDung}` }));
        
        res.json({ success: true, data: dataWithKey });
    } catch (error) {
        console.error("Lỗi getChiTietLichSu:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

module.exports = { getThongKeCaNhan, getPhieuMuon, getChiTietLichSu };