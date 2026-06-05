const pool = require('../config/db.config');

// Lấy danh sách yêu cầu đã duyệt - chờ giao thiết bị
const layDanhSachChoGiao = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT 
                y.ma_yeu_cau AS maYC,
                u.ten AS tenSV,
                y.ma_nguoi_muon AS maSV,
                t.ten_thiet_bi AS thietBi,
                c.soluong AS soLuong,
                DATE_FORMAT(y.ngay_muon, '%Y-%m-%d') AS ngayMuon,
                DATE_FORMAT(y.ngay_tra_du_kien, '%Y-%m-%d') AS hanTra
            FROM yeucaumuon y
            JOIN chitietdon c ON y.ma_yeu_cau = c.ma_yeu_cau
            JOIN thietbi t ON c.ma_thiet_bi = t.ma_thiet_bi
            JOIN users u ON y.ma_nguoi_muon = u.ma_sv
            WHERE y.trang_thai = 'Đã duyệt'
            ORDER BY y.ngay_muon DESC`
        );

        const data = rows.map((row, index) => ({
            key: 'g' + index,
            maYC: row.maYC,
            tenSV: row.tenSV,
            maSV: row.maSV,
            thietBi: row.thietBi,
            soLuong: row.soLuong,
            ngayMuon: row.ngayMuon,
            hanTra: row.hanTra,
            trangThai: 'da_duyet',
        }));

        res.json({ success: true, data: data });
    } catch (error) {
        console.error("Lỗi layDanhSachChoGiao:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

// Lấy danh sách đang mượn + quá hạn
const layDanhSachDangMuon = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT 
                y.ma_yeu_cau AS maYC,
                u.ten AS tenSV,
                y.ma_nguoi_muon AS maSV,
                t.ten_thiet_bi AS thietBi,
                c.soluong AS soLuong,
                DATE_FORMAT(y.ngay_muon, '%Y-%m-%d') AS ngayMuon,
                DATE_FORMAT(y.ngay_tra_du_kien, '%Y-%m-%d') AS hanTra,
                c.trang_thai AS trangThaiChiTiet,
                y.ngay_tra_du_kien
            FROM yeucaumuon y
            JOIN chitietdon c ON y.ma_yeu_cau = c.ma_yeu_cau
            JOIN thietbi t ON c.ma_thiet_bi = t.ma_thiet_bi
            JOIN users u ON y.ma_nguoi_muon = u.ma_sv
            WHERE c.trang_thai = 'chưa trả'
            ORDER BY y.ngay_muon DESC`
        );

        const data = rows.map((row, index) => {
            let trangThai = 'dang_muon';
            if (new Date(row.ngay_tra_du_kien) < new Date()) {
                trangThai = 'qua_han';
            }
            return {
                key: 'm' + index,
                maYC: row.maYC,
                tenSV: row.tenSV,
                maSV: row.maSV,
                thietBi: row.thietBi,
                soLuong: row.soLuong,
                ngayMuon: row.ngayMuon,
                hanTra: row.hanTra,
                trangThai: trangThai,
            };
        });

        res.json({ success: true, data: data });
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

module.exports = { layDanhSachChoGiao, layDanhSachDangMuon, ghiNhanChoMuon, ghiNhanDaTra };
