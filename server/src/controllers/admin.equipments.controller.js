const pool = require('../config/db.config');

// Lấy danh sách thiết bị (admin)
const getDanhSachThietBi = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const danhMuc = req.query.danhMuc;
        const tuKhoa = req.query.tuKhoa;

        let whereClause = 'WHERE 1=1';
        let queryParams = [];

        if (danhMuc && danhMuc !== 'tat-ca') {
            whereClause += ' AND ma_danh_muc = ?';
            queryParams.push(danhMuc);
        }

        if (tuKhoa) {
            whereClause += ' AND (ten_thiet_bi LIKE ? OR ma_thiet_bi LIKE ?)';
            queryParams.push(`%${tuKhoa}%`, `%${tuKhoa}%`);
        }

        const countQuery = `SELECT COUNT(*) as total FROM thietbi ${whereClause}`;
        const [countRows] = await pool.query(countQuery, queryParams);
        const [maxRows] = await pool.query(`
            SELECT MAX(CAST(SUBSTRING(ma_thiet_bi, 3) AS UNSIGNED)) as maxNum 
            FROM thietbi 
            WHERE ma_thiet_bi LIKE 'TB%'
        `);
        let nextId = 'TB0001';
        if (maxRows[0].maxNum) {
            nextId = 'TB' + (maxRows[0].maxNum + 1).toString().padStart(4, '0');
        }

        const dataQuery = `
            SELECT ma_thiet_bi, ten_thiet_bi, hinh_anh AS img, mo_ta, 
                   tong_so_luong, so_luong_con_lai, 
                   ma_danh_muc, tinh_trang
            FROM thietbi 
            ${whereClause} 
            ORDER BY ma_thiet_bi DESC 
            LIMIT ? OFFSET ?
        `;
        const [rows] = await pool.query(dataQuery, [...queryParams, limit, offset]);

        res.json({ success: true, data: rows, total: countRows[0].total, nextId: nextId });
    } catch (error) {
        console.error("Lỗi lấy danh sách:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

// Thêm
const themThietBi = async (req, res) => {
    try {
        const { ten_thiet_bi, mo_ta, tong_so_luong, ma_danh_muc, img } = req.body;

        const [rows] = await pool.query(`
            SELECT MAX(CAST(SUBSTRING(ma_thiet_bi, 3) AS UNSIGNED)) as maxNum 
            FROM thietbi 
            WHERE ma_thiet_bi LIKE 'TB%'
        `);
        
        let ma_thiet_bi = 'TB0001';
        if (rows[0].maxNum) {
            const nextNum = rows[0].maxNum + 1;
            ma_thiet_bi = 'TB' + nextNum.toString().padStart(4, '0');
        }

        await pool.query(
            `INSERT INTO thietbi (ma_thiet_bi, ten_thiet_bi, mo_ta, tong_so_luong, ma_danh_muc, hinh_anh, so_luong_da_cho_muon)
             VALUES (?, ?, ?, ?, ?, ?, 0)`,
            [ma_thiet_bi, ten_thiet_bi, mo_ta, tong_so_luong, ma_danh_muc, img]
        );

        res.json({ success: true, message: "Thêm thiết bị thành công", ma_thiet_bi: ma_thiet_bi });
    } catch (error) {
        console.error("Lỗi thêm thiết bị:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

// Sửa
const suaThietBi = async (req, res) => {
    try {
        const id = req.params.id;
        const { ten_thiet_bi, mo_ta, tong_so_luong, ma_danh_muc, img } = req.body;
        await pool.query(
            `UPDATE thietbi 
             SET ten_thiet_bi = ?, mo_ta = ?, tong_so_luong = ?, ma_danh_muc = ?, hinh_anh = ?
             WHERE ma_thiet_bi = ?`,
            [ten_thiet_bi, mo_ta, tong_so_luong, ma_danh_muc, img, id]
        );

        res.json({ success: true, message: "Cập nhật thiết bị thành công" });
    } catch (error) {
        console.error("Lỗi sửa thiết bị:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

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

module.exports = { getDanhSachThietBi, themThietBi, suaThietBi, xoaThietBi };