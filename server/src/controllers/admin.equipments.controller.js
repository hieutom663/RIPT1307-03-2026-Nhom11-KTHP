const pool = require('../config/db.config');

// Lấy danh sách thiết bị (admin)
const layDanhSachThietBi = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const [rows] = await pool.query(
            `SELECT ma_thiet_bi, ten_thiet_bi, hinh_anh AS img, mo_ta AS moTa, 
             tong_so_luong AS soLuongTong, so_luong_con_lai AS soLuongConLai, 
             id_danhmuc, tinh_trang
             FROM thietbi LIMIT ? OFFSET ?`,
            [limit, offset]
        );

        const [countRows] = await pool.query("SELECT COUNT(*) as total FROM thietbi");

        res.json({ success: true, data: rows, total: countRows[0].total });
    } catch (error) {
        console.error("Lỗi lấy danh sách:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

// Thêm thiết bị mới
const themThietBi = async (req, res) => {
    try {
        const { ten_thiet_bi, mo_ta, tong_so_luong, id_danhmuc, hinh_anh } = req.body;

        const [maxRows] = await pool.query("SELECT MAX(ma_thiet_bi) as maxId FROM thietbi");
        let ma_thiet_bi = 'TB0001';
        if (maxRows[0].maxId) {
            const currentNum = parseInt(maxRows[0].maxId.replace('TB', ''), 10);
            const nextNum = currentNum + 1;
            ma_thiet_bi = 'TB' + nextNum.toString().padStart(4, '0');
        }

        await pool.query(
            `INSERT INTO thietbi (ma_thiet_bi, ten_thiet_bi, mo_ta, tong_so_luong, id_danhmuc, hinh_anh, so_luong_da_cho_muon)
             VALUES (?, ?, ?, ?, ?, ?, 0)`,
            [ma_thiet_bi, ten_thiet_bi, mo_ta, tong_so_luong, id_danhmuc, hinh_anh]
        );

        res.json({ success: true, message: "Thêm thiết bị thành công", ma_thiet_bi: ma_thiet_bi });
    } catch (error) {
        console.error("Lỗi thêm thiết bị:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

// Sửa thiết bị
const suaThietBi = async (req, res) => {
    try {
        const id = req.params.id;
        const { ten_thiet_bi, mo_ta, tong_so_luong, id_danhmuc, hinh_anh } = req.body;

        await pool.query(
            `UPDATE thietbi SET ten_thiet_bi = ?, mo_ta = ?, tong_so_luong = ?, id_danhmuc = ?, hinh_anh = ?
             WHERE ma_thiet_bi = ?`,
            [ten_thiet_bi, mo_ta, tong_so_luong, id_danhmuc, hinh_anh, id]
        );

        res.json({ success: true, message: "Cập nhật thiết bị thành công" });
    } catch (error) {
        console.error("Lỗi sửa thiết bị:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

// Xóa thiết bị
const xoaThietBi = async (req, res) => {
    try {
        const id = req.params.id;

        await pool.query("DELETE FROM thietbi WHERE ma_thiet_bi = ?", [id]);

        res.json({ success: true, message: "Xóa thiết bị thành công" });
    } catch (error) {
        console.error("Lỗi xóa thiết bị:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

module.exports = { layDanhSachThietBi, themThietBi, suaThietBi, xoaThietBi };
