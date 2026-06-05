const pool = require('../config/db.config');

// Lấy danh sách yêu cầu đã duyệt - chờ giao thiết bị
const layDanhSachChoGiao = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT 
                y.ma_yeu_cau AS maYC,
                u.ho_ten AS tenSV,
                y.ma_nguoi_muon AS maSV,
                t.ten_thiet_bi AS thietBi,
                c.so_luong AS soLuong,
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
                u.ho_ten AS tenSV,
                y.ma_nguoi_muon AS maSV,
                t.ten_thiet_bi AS thietBi,
                c.so_luong AS soLuong,
                DATE_FORMAT(y.ngay_muon, '%Y-%m-%d') AS ngayMuon,
                DATE_FORMAT(y.ngay_tra_du_kien, '%Y-%m-%d') AS hanTra,
                c.trang_thai AS trangThaiChiTiet,
                y.ngay_tra_du_kien
            FROM yeucaumuon y
            JOIN chitietdon c ON y.ma_yeu_cau = c.ma_yeu_cau
            JOIN thietbi t ON c.ma_thiet_bi = t.ma_thiet_bi
            JOIN users u ON y.ma_nguoi_muon = u.ma_sv
            WHERE c.trang_thai = 'Chưa trả'
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
        res.status(500).json({ success: false, message: "Lỗi server khi lấy thống kê lịch sử!" });
    }
};

// Ghi nhận cho mượn (chuyển trạng thái từ "Đã duyệt" sang "Đang mượn")
const ghiNhanChoMuon = async (req, res) => {
    try {
        const maYC = req.params.maYC;

        // Cập nhật trạng thái yêu cầu
        const [result] = await pool.query(
            "UPDATE yeucaumuon SET trang_thai = 'Đang mượn' WHERE ma_yeu_cau = ? AND trang_thai = 'Đã duyệt'",
            [maYC]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy yêu cầu hoặc yêu cầu không ở trạng thái 'Đã duyệt'" });
        }

        res.json({ success: true, message: "Đã ghi nhận cho mượn thành công" });
    } catch (error) {
        console.error("Lỗi ghiNhanChoMuon:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

// Ghi nhận đã trả (chuyển trạng thái sang "Hoàn thành" và cập nhật ngày trả)
const ghiNhanDaTra = async (req, res) => {
    try {
        const maYC = req.params.maYC;

        // Cập nhật trạng thái chi tiết đơn
        await pool.query(
            "UPDATE chitietdon SET trang_thai = 'Đã trả', ngay_tra = CURDATE() WHERE ma_yeu_cau = ?",
            [maYC]
        );

        // Cập nhật trạng thái yêu cầu mượn
        const [result] = await pool.query(
            "UPDATE yeucaumuon SET trang_thai = 'Hoàn thành' WHERE ma_yeu_cau = ? AND trang_thai = 'Đang mượn'",
            [maYC]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy yêu cầu hoặc yêu cầu không ở trạng thái 'Đang mượn'" });
        }

        // Cập nhật lại số lượng thiết bị đã cho mượn
        const [chiTiet] = await pool.query(
            "SELECT ma_thiet_bi, so_luong FROM chitietdon WHERE ma_yeu_cau = ?",
            [maYC]
        );

        for (const ct of chiTiet) {
            await pool.query(
                "UPDATE thietbi SET so_luong_da_cho_muon = so_luong_da_cho_muon - ? WHERE ma_thiet_bi = ?",
                [ct.so_luong, ct.ma_thiet_bi]
            );
        }

        res.json({ success: true, message: "Đã ghi nhận trả thành công" });
    } catch (error) {
        console.error("Lỗi ghiNhanDaTra:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

// Thống kê lịch sử mượn trả (cho trang LichSuMuon)
const getThongKeLichSu = async (req, res) => {
    try {
        const [
            [choXuLy],
            [dangMuon],
            [quaHan],
            [daTra]
        ] = await Promise.all([
            pool.query("SELECT COUNT(*) AS total FROM yeucaumuon WHERE trang_thai = 'Chờ duyệt'"),
            pool.query("SELECT COUNT(*) AS total FROM yeucaumuon WHERE trang_thai = 'Đang mượn'"),
            pool.query("SELECT COUNT(*) AS total FROM yeucaumuon WHERE trang_thai = 'Đang mượn' AND ngay_tra_du_kien < CURDATE()"),
            pool.query("SELECT COUNT(*) AS total FROM yeucaumuon WHERE trang_thai = 'Hoàn thành'")
        ]);

        res.json({
            success: true,
            data: {
                choXuLy: choXuLy[0].total || 0,
                dangMuon: dangMuon[0].total || 0,
                quaHan: quaHan[0].total || 0,
                daTra: daTra[0].total || 0
            }
        });
    } catch (error) {
        console.error("Lỗi getThongKeLichSu:", error);
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
                       -- ĐÃ SỬA: Đổi NOW() thành CURDATE() để đồng bộ với hàm getThongKeAdmin
                       WHEN y.trang_thai = 'Đang mượn' AND y.ngay_tra_du_kien < CURDATE() THEN 'Quá hạn'
                       WHEN y.trang_thai = 'Đang mượn' THEN 'Đang mượn'
                       -- ĐÃ SỬA: Trả về trạng thái gốc của phiếu (Chờ duyệt, Từ chối...) thay vì ép thành 'Chưa trả'
                       ELSE y.trang_thai
                   END AS trangThai
            FROM chitietdon c
            JOIN yeucaumuon y ON c.ma_yeu_cau = y.ma_yeu_cau
            JOIN thietbi t ON c.ma_thiet_bi = t.ma_thiet_bi
            ORDER BY y.ngay_muon DESC, c.ma_don_muon DESC
        `;
        const [rows] = await pool.query(query);
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error("Lỗi getAllChiTietLichSu:", error);
        res.status(500).json({ success: false, message: "Lỗi server khi lấy chi tiết lịch sử!" });
    }
};

module.exports = { layDanhSachChoGiao, layDanhSachDangMuon, ghiNhanChoMuon, ghiNhanDaTra, getThongKeLichSu, getAllPhieuMuon, getAllChiTietLichSu };
