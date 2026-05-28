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
        console.error("Lỗi layDanhSachDangMuon:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

// Ghi nhận cho mượn (chuyển từ "Đã duyệt" sang "Đang mượn")
const ghiNhanChoMuon = async (req, res) => {
    try {
        const maYC = req.params.maYC;

        await pool.query(
            `UPDATE yeucaumuon SET trang_thai = 'Đang mượn' WHERE ma_yeu_cau = ?`,
            [maYC]
        );

        res.json({ success: true, message: "Đã ghi nhận cho mượn" });
    } catch (error) {
        console.error("Lỗi ghiNhanChoMuon:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

// Ghi nhận đã trả
const ghiNhanDaTra = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const maYC = req.params.maYC;

        await connection.beginTransaction();

        // Cập nhật trạng thái chi tiết đơn
        await connection.query(
            `UPDATE chitietdon SET trang_thai = 'Đã trả' WHERE ma_yeu_cau = ?`,
            [maYC]
        );

        // Trả lại số lượng thiết bị
        const [chiTietRows] = await connection.query(
            `SELECT ma_thiet_bi, soluong FROM chitietdon WHERE ma_yeu_cau = ?`,
            [maYC]
        );

        for (let i = 0; i < chiTietRows.length; i++) {
            await connection.query(
                `UPDATE thietbi SET so_luong_da_cho_muon = so_luong_da_cho_muon - ? WHERE ma_thiet_bi = ?`,
                [chiTietRows[i].soluong, chiTietRows[i].ma_thiet_bi]
            );
        }

        // Cập nhật trạng thái yêu cầu
        await connection.query(
            `UPDATE yeucaumuon SET trang_thai = 'Hoàn thành' WHERE ma_yeu_cau = ?`,
            [maYC]
        );

        await connection.commit();
        connection.release();

        res.json({ success: true, message: "Đã ghi nhận trả thiết bị" });
    } catch (error) {
        await connection.rollback();
        connection.release();
        console.error("Lỗi ghiNhanDaTra:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

module.exports = { layDanhSachChoGiao, layDanhSachDangMuon, ghiNhanChoMuon, ghiNhanDaTra };
