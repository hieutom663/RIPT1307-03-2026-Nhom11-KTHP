const pool = require('../config/db.config');

const getThongKeAdmin = async (req, res) => {
    try {
        const [
            [choXuLy],
            [dangMuon],
            [quaHan],
            [daTra]
        ] = await Promise.all([
            pool.query("SELECT COUNT(*) AS total FROM yeucaumuon WHERE trang_thai = 'Chờ duyệt'"),
            pool.query("SELECT COUNT(*) AS total FROM yeucaumuon WHERE trang_thai = 'Đang mượn'"),
            pool.query("SELECT COUNT(*) AS total FROM yeucaumuon WHERE trang_thai = 'Đang mượn' AND ngay_tra_du_kien < NOW()"),
            pool.query("SELECT COUNT(*) AS total FROM yeucaumuon WHERE trang_thai = 'Hoàn thành'")
        ]);

        res.status(200).json({
            success: true,
            data: {
                choXuLy: choXuLy[0].total || 0,
                dangMuon: dangMuon[0].total || 0,
                quaHan: quaHan[0].total || 0,
                daTra: daTra[0].total || 0
            }
        });
    } catch (error) {
        console.error("Lỗi getThongKeAdmin:", error);
        res.status(500).json({ success: false, message: "Lỗi server khi lấy thống kê lịch sử!" });
    }
};

const getAllPhieuMuon = async (req, res) => {
    try {
        const query = `
            SELECT y.ma_nguoi_muon AS ma_sv, y.ma_yeu_cau AS maYeuCau, 
                   DATE_FORMAT(y.ngay_muon, '%Y-%m-%d') AS ngayTao, 
                   DATE_FORMAT(y.ngay_tra_du_kien, '%Y-%m-%d') AS ngayTraDuKien, 
                   y.ly_do_muon AS lyDo, y.trang_thai AS trangThai
            FROM yeucaumuon y
            ORDER BY y.ngay_muon DESC
        `;
        const [rows] = await pool.query(query);
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error("Lỗi getAllPhieuMuon:", error);
        res.status(500).json({ success: false, message: "Lỗi server khi lấy danh sách phiếu mượn!" });
    }
};

const getAllChiTietLichSu = async (req, res) => {
    try {
        const query = `
            SELECT y.ma_nguoi_muon AS ma_sv, y.ma_yeu_cau AS maPhieu, 
                   c.ma_thiet_bi AS maDoDung, t.ten_thiet_bi AS tenDoDung, 
                   c.so_luong AS soLuong, 
                   DATE_FORMAT(y.ngay_tra_du_kien, '%Y-%m-%d') AS hanTra,
                   CASE 
                       WHEN y.trang_thai = 'Hoàn thành' THEN 'Đã trả'
                       WHEN y.ngay_tra_du_kien < NOW() AND y.trang_thai = 'Đang mượn' THEN 'Quá hạn'
                       ELSE 'Chưa trả'
                   END AS trangThai
            FROM chitietdon c
            JOIN yeucaumuon y ON c.ma_yeu_cau = y.ma_yeu_cau
            JOIN thietbi t ON c.ma_thiet_bi = t.ma_thiet_bi
            ORDER BY y.ngay_tra_du_kien DESC
        `;
        const [rows] = await pool.query(query);
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error("Lỗi getAllChiTietLichSu:", error);
        res.status(500).json({ success: false, message: "Lỗi server khi lấy chi tiết lịch sử!" });
    }
};

module.exports = {
    getThongKeAdmin,
    getAllPhieuMuon,
    getAllChiTietLichSu
};