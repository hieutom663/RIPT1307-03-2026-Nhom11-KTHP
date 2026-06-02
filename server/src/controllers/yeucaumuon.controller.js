const pool = require('../config/db.config');

/**
 * Lấy danh sách tất cả yêu cầu mượn (Admin)
 * GET /api/admin/yeu-cau-muon
 */
const getDanhSachYeuCau = async (req, res) => {
    try {
        const queryStr = `
            SELECT 
                y.ma_yeu_cau AS maYC,
                u.ho_ten AS tenSV,
                y.ma_nguoi_muon AS maSV,
                GROUP_CONCAT(t.ten_thiet_bi SEPARATOR ', ') AS thietBi,
                SUM(c.so_luong) AS soLuong,
                DATE_FORMAT(y.ngay_muon, '%Y-%m-%d') AS ngayMuon,
                DATE_FORMAT(y.ngay_tra_du_kien, '%Y-%m-%d') AS ngayTraDK,
                CASE 
                    WHEN y.trang_thai = 'Chờ duyệt' THEN 'cho_duyet'
                    WHEN y.trang_thai = 'Đã duyệt' THEN 'da_duyet'
                    WHEN y.trang_thai = 'Đang mượn' THEN 'dang_muon'
                    WHEN y.trang_thai = 'Hoàn thành' THEN 'da_tra'
                    WHEN y.trang_thai = 'Bị từ chối' THEN 'tu_choi'
                    ELSE 
                        CASE 
                            WHEN y.trang_thai = 'Đang mượn' AND y.ngay_tra_du_kien < CURDATE() THEN 'qua_han'
                            ELSE 'cho_duyet'
                        END
                END AS trangThai
            FROM yeucaumuon y
            JOIN users u ON y.ma_nguoi_muon = u.ma_sv
            JOIN chitietdon c ON y.ma_yeu_cau = c.ma_yeu_cau
            JOIN thietbi t ON c.ma_thiet_bi = t.ma_thiet_bi
            GROUP BY y.ma_yeu_cau, u.ho_ten, y.ma_nguoi_muon, y.ngay_muon, y.ngay_tra_du_kien, y.trang_thai
            ORDER BY y.ngay_muon DESC, y.ma_yeu_cau DESC
        `;

        const [rows] = await pool.query(queryStr);
        const data = rows.map((row, index) => {
            let trangThai = row.trangThai;
            if (row.trangThai === 'dang_muon') {
                const ngayTraDK = new Date(row.ngayTraDK);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (ngayTraDK < today) {
                    trangThai = 'qua_han';
                }
            }
            return {
                ...row,
                key: String(index + 1),
                soLuong: Number(row.soLuong) || 0,
                trangThai
            };
        });

        res.json({ success: true, data });

    } catch (error) {
        console.error("Lỗi getDanhSachYeuCau:", error);
        res.status(500).json({ success: false, message: "Lỗi server khi lấy danh sách yêu cầu mượn" });
    }
};

/**
 * Xem chi tiết yêu cầu mượn
 * GET /api/admin/yeu-cau-muon/:maYC/chi-tiet
 */
const getChiTietYeuCau = async (req, res) => {
    try {
        const { maYC } = req.params;

        const [ycRows] = await pool.query(`
            SELECT 
                y.ma_yeu_cau AS maYC,
                y.ma_nguoi_muon AS maSV,
                u.ho_ten AS tenSV,
                u.email AS emailSV,
                u.so_phone AS sdtSV,
                DATE_FORMAT(y.ngay_muon, '%Y-%m-%d') AS ngayMuon,
                DATE_FORMAT(y.ngay_tra_du_kien, '%Y-%m-%d') AS ngayTraDK,
                DATE_FORMAT(y.ngay_duyet, '%Y-%m-%d') AS ngayDuyet,
                y.ly_do_muon AS lyDoMuon,
                y.ly_do_tu_choi AS lyDoTuChoi,
                y.trang_thai AS trangThaiGoc,
                CASE 
                    WHEN y.trang_thai = 'Chờ duyệt' THEN 'cho_duyet'
                    WHEN y.trang_thai = 'Đã duyệt' THEN 'da_duyet'
                    WHEN y.trang_thai = 'Đang mượn' THEN 'dang_muon'
                    WHEN y.trang_thai = 'Hoàn thành' THEN 'da_tra'
                    WHEN y.trang_thai = 'Bị từ chối' THEN 'tu_choi'
                    ELSE 'cho_duyet'
                END AS trangThai
            FROM yeucaumuon y
            JOIN users u ON y.ma_nguoi_muon = u.ma_sv
            WHERE y.ma_yeu_cau = ?
        `, [maYC]);

        if (ycRows.length === 0) {
            return res.json({ success: false, message: "Không tìm thấy yêu cầu" });
        }

        const yeuCau = ycRows[0];

        if (yeuCau.trangThai === 'dang_muon') {
            const ngayTraDK = new Date(yeuCau.ngayTraDK);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (ngayTraDK < today) {
                yeuCau.trangThai = 'qua_han';
            }
        }

        const [ctRows] = await pool.query(`
            SELECT 
                c.ma_don_muon AS maDonMuon,
                c.ma_thiet_bi AS maThietBi,
                t.ten_thiet_bi AS tenThietBi,
                d.ten_danh_muc AS danhMuc,
                c.so_luong AS soLuong,
                DATE_FORMAT(c.ngay_tra, '%Y-%m-%d') AS ngayTraThucTe,
                c.trang_thai AS trangThaiThietBi
            FROM chitietdon c
            JOIN thietbi t ON c.ma_thiet_bi = t.ma_thiet_bi
            LEFT JOIN danhmuc d ON t.ma_danh_muc = d.ma_danh_muc
            WHERE c.ma_yeu_cau = ?
        `, [maYC]);

        res.json({
            success: true,
            data: {
                ...yeuCau,
                chiTietThietBi: ctRows
            }
        });

    } catch (error) {
        console.error("Lỗi getChiTietYeuCau:", error);
        res.status(500).json({ success: false, message: "Lỗi server khi lấy chi tiết yêu cầu" });
    }
};

/**
 * Duyệt yêu cầu mượn
 * PUT /api/admin/yeu-cau-muon/:maYC/duyet
 */
const duyetYeuCau = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { maYC } = req.params;
        const maAdminDuyet = req.user?.ma_admin || 'AD0001'; 

        await connection.beginTransaction();

        const [yeuCauRows] = await connection.query(
            "SELECT * FROM yeucaumuon WHERE ma_yeu_cau = ? AND trang_thai = 'Chờ duyệt'",
            [maYC]
        );

        if (yeuCauRows.length === 0) {
            await connection.rollback();
            connection.release();
            return res.json({ success: false, message: "Yêu cầu không tồn tại hoặc không ở trạng thái chờ duyệt" });
        }

        const maNguoiMuon = yeuCauRows[0].ma_nguoi_muon;

        const [chiTietRows] = await connection.query(
            "SELECT ma_thiet_bi, so_luong FROM chitietdon WHERE ma_yeu_cau = ?",
            [maYC]
        );

        for (const ct of chiTietRows) {
            const [tbRows] = await connection.query(
                "SELECT so_luong_con_lai FROM thietbi WHERE ma_thiet_bi = ?",
                [ct.ma_thiet_bi]
            );
            if (tbRows.length > 0 && tbRows[0].so_luong_con_lai < ct.so_luong) {
                await connection.rollback();
                connection.release();
                return res.json({ 
                    success: false, 
                    message: `Thiết bị ${ct.ma_thiet_bi} không đủ số lượng để duyệt` 
                });
            }
        }

        await connection.query(
            `UPDATE yeucaumuon 
             SET trang_thai = 'Đang mượn', 
                 ngay_duyet = NOW(), 
                 ma_nguoi_duyet = ? 
             WHERE ma_yeu_cau = ?`,
            [maAdminDuyet, maYC]
        );

        for (const ct of chiTietRows) {
            await connection.query(
                `UPDATE thietbi 
                 SET so_luong_da_cho_muon = so_luong_da_cho_muon + ? 
                 WHERE ma_thiet_bi = ?`,
                [ct.so_luong, ct.ma_thiet_bi] 
            );
        }

        const tieuDe = 'Đã duyệt đơn';
        const noiDung = `Đơn mượn ${maYC} của bạn đã được duyệt thành công.`;
        
        await connection.query(
            `INSERT INTO thongbao (tieu_de, noi_dung, ngay, nguoinhan_id, loai, trang_thai) 
             VALUES (?, ?, NOW(), ?, 'duyệt', 'chua_doc')`,
            [tieuDe, noiDung, maNguoiMuon]
        );

        await connection.commit();
        connection.release();

        res.json({ success: true, message: `Đã duyệt yêu cầu ${maYC} thành công` });

    } catch (error) {
        await connection.rollback();
        connection.release();
        console.error("Lỗi duyetYeuCau:", error);
        res.status(500).json({ success: false, message: "Lỗi server khi duyệt yêu cầu" });
    }
};

/**
 * Từ chối yêu cầu mượn (có lý do)
 * PUT /api/admin/yeu-cau-muon/:maYC/tu-choi
 */
const tuChoiYeuCau = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { maYC } = req.params;
        const { lyDoTuChoi } = req.body;
        
        const maAdminTuChoi = req.user?.ma_admin || 'AD0001';

        await connection.beginTransaction();

        const [yeuCauRows] = await connection.query(
            "SELECT * FROM yeucaumuon WHERE ma_yeu_cau = ? AND trang_thai = 'Chờ duyệt'",
            [maYC]
        );

        if (yeuCauRows.length === 0) {
            await connection.rollback();
            connection.release();
            return res.json({ success: false, message: "Yêu cầu không tồn tại hoặc không ở trạng thái chờ duyệt" });
        }

        const maNguoiMuon = yeuCauRows[0].ma_nguoi_muon;

        await connection.query(
            `UPDATE yeucaumuon 
             SET trang_thai = 'Bị từ chối', 
                 ngay_duyet = NOW(), 
                 ma_nguoi_duyet = ?, 
                 ly_do_tu_choi = ? 
             WHERE ma_yeu_cau = ?`,
            [maAdminTuChoi, lyDoTuChoi || null, maYC]
        );

        const [chiTietRows] = await connection.query(
            "SELECT ma_thiet_bi, so_luong FROM chitietdon WHERE ma_yeu_cau = ?",
            [maYC]
        );

        for (const ct of chiTietRows) {
            await connection.query(
                `UPDATE thietbi 
                 SET so_luong_da_cho_muon = GREATEST(so_luong_da_cho_muon - ?, 0) 
                 WHERE ma_thiet_bi = ?`,
                [ct.so_luong, ct.ma_thiet_bi] 
            );
        }

        const tieuDe = 'YC bị từ chối';
        const lyDoNgan = lyDoTuChoi ? (lyDoTuChoi.length > 100 ? lyDoTuChoi.substring(0, 100) + '...' : lyDoTuChoi) : 'Không rõ lý do';
        const noiDung = `Đơn ${maYC} bị từ chối. Lý do: ${lyDoNgan}`;
        
        await connection.query(
            `INSERT INTO thongbao (tieu_de, noi_dung, ngay, nguoinhan_id, loai, trang_thai) 
             VALUES (?, ?, NOW(), ?, 'từ chối', 'chua_doc')`,
            [tieuDe, noiDung, maNguoiMuon]
        );

        await connection.commit();
        connection.release();

        res.json({ success: true, message: `Đã từ chối yêu cầu ${maYC}` });

    } catch (error) {
        await connection.rollback();
        connection.release();
        console.error("Lỗi tuChoiYeuCau:", error);
        res.status(500).json({ success: false, message: "Lỗi server khi từ chối yêu cầu" });
    }
};

const xacNhanTraThietBi = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { maYC } = req.params;
        await connection.beginTransaction();

        const [yeuCauRows] = await connection.query(
            "SELECT * FROM yeucaumuon WHERE ma_yeu_cau = ? AND trang_thai = 'Đang mượn'",
            [maYC]
        );

        if (yeuCauRows.length === 0) {
            await connection.rollback();
            connection.release();
            return res.json({ success: false, message: "Yêu cầu không tồn tại hoặc không ở trạng thái Đang mượn" });
        }

        const maNguoiMuon = yeuCauRows[0].ma_nguoi_muon;

        await connection.query(
            "UPDATE yeucaumuon SET trang_thai = 'Hoàn thành' WHERE ma_yeu_cau = ?",
            [maYC]
        );

        const [chiTietRows] = await connection.query(
            "SELECT ma_thiet_bi, so_luong FROM chitietdon WHERE ma_yeu_cau = ?",
            [maYC]
        );

        await connection.query(
            "UPDATE chitietdon SET ngay_tra = NOW(), trang_thai = 'Đã trả' WHERE ma_yeu_cau = ?",
            [maYC]
        );

        for (const ct of chiTietRows) {
            await connection.query(
                `UPDATE thietbi 
                 SET so_luong_da_cho_muon = GREATEST(so_luong_da_cho_muon - ?, 0) 
                 WHERE ma_thiet_bi = ?`,
                [ct.so_luong, ct.ma_thiet_bi]
            );
        }

        const tieuDe = 'Xác nhận trả đồ';
        const noiDung = `Đơn mượn ${maYC} của bạn đã được Admin xác nhận thu hồi thành công. Cảm ơn bạn!`;
        
        await connection.query(
            `INSERT INTO thongbao (tieu_de, noi_dung, ngay, nguoinhan_id, loai, trang_thai) 
             VALUES (?, ?, NOW(), ?, 'duyệt', 'chua_doc')`,
            [tieuDe, noiDung, maNguoiMuon]
        );

        await connection.commit();
        connection.release();

        res.json({ success: true, message: `Đã xác nhận trả thiết bị cho phiếu ${maYC}` });

    } catch (error) {
        await connection.rollback();
        connection.release();
        console.error("Lỗi xacNhanTraThietBi:", error);
        res.status(500).json({ success: false, message: "Lỗi server khi xác nhận trả thiết bị" });
    }
};

module.exports = { getDanhSachYeuCau, getChiTietYeuCau, duyetYeuCau, tuChoiYeuCau, xacNhanTraThietBi };