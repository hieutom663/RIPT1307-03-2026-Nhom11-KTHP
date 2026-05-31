const pool = require('../config/db.config');

const getDanhSachThongBaoAdmin = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT id, tieu_de, noi_dung, ngay, nguoinhan_id, loai, trang_thai 
            FROM thongbao 
            WHERE nguoinhan_id LIKE 'AD%' 
            ORDER BY ngay DESC 
            LIMIT 10
        `);

        const data = rows.map(row => ({
            id: row.id,
            title: row.tieu_de,
            desc: row.noi_dung,
            time: row.ngay, 
            unread: row.trang_thai !== 'da_doc' 
        }));

        res.json({ success: true, data: data });
    } catch (error) {
        console.error("Lỗi lấy danh sách thông báo:", error);
        res.status(500).json({ success: false, message: "Lỗi server khi lấy thông báo" });
    }
};

const danhDauDaDoc = async (req, res) => {
    try {
        const id = req.params.id;
        await pool.query(
            "UPDATE thongbao SET trang_thai = 'da_doc' WHERE id = ?", 
            [id]
        );
        res.json({ success: true, message: "Đã cập nhật trạng thái thông báo" });
    } catch (error) {
        console.error("Lỗi cập nhật thông báo:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

const danhDauDocTatCa = async (req, res) => {
    try {
        await pool.query(`
            UPDATE thongbao 
            SET trang_thai = 'da_doc' 
            WHERE nguoinhan_id LIKE 'AD%' 
              AND (trang_thai IS NULL OR trang_thai != 'da_doc')
        `);
        res.json({ success: true, message: "Đã đánh dấu đọc tất cả" });
    } catch (error) {
        console.error("Lỗi cập nhật tất cả thông báo:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
}; // <-- Đã bổ sung dấu ngoặc đóng ở đây

const getDanhSachThongBaoUser = async (req, res) => {
    try {
        const maSV = req.query.maSV;
        if (!maSV) return res.json({ success: false, message: "Thiếu mã sinh viên" });

        const [rows] = await pool.query(`
            SELECT id, tieu_de, noi_dung, ngay, nguoinhan_id, loai, trang_thai 
            FROM thongbao 
            WHERE nguoinhan_id = ? 
            ORDER BY ngay DESC 
            LIMIT 20
        `, [maSV]);

        const data = rows.map(row => ({
            id: row.id,
            title: row.tieu_de,
            desc: row.noi_dung,
            time: row.ngay, 
            unread: row.trang_thai !== 'da_doc' 
        }));

        res.json({ success: true, data: data });
    } catch (error) {
        console.error("Lỗi lấy danh sách thông báo User:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

const danhDauDocTatCaUser = async (req, res) => {
    try {
        const maSV = req.body.maSV;
        await pool.query(`
            UPDATE thongbao 
            SET trang_thai = 'da_doc' 
            WHERE nguoinhan_id = ? 
              AND (trang_thai IS NULL OR trang_thai != 'da_doc')
        `, [maSV]);
        res.json({ success: true, message: "Đã đánh dấu đọc tất cả" });
    } catch (error) {
        console.error("Lỗi cập nhật tất cả thông báo User:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

module.exports = { 
    getDanhSachThongBaoAdmin, 
    danhDauDaDoc, 
    danhDauDocTatCa,
    getDanhSachThongBaoUser,
    danhDauDocTatCaUser
};