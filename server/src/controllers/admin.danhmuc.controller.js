const pool = require('../config/db.config');

// ===== GET /api/admin/danh-muc =====
// Lấy danh sách danh mục kèm số lượng thiết bị, có thể lọc theo trang_thai
const getDanhSachDanhMuc = async (req, res) => {
    try {
        const { trangThai } = req.query;

        let sql = `
            SELECT 
                dm.ma_danh_muc,
                dm.ten_danh_muc,
                dm.mo_ta,
                dm.trang_thai,
                COUNT(tb.ma_thiet_bi) AS so_luong_thiet_bi
            FROM danhmuc dm
            LEFT JOIN thietbi tb ON tb.ma_danh_muc = dm.ma_danh_muc
            WHERE 1=1
        `;
        const params = [];

        if (trangThai && trangThai !== 'tat-ca') {
            sql += ' AND dm.trang_thai = ?';
            params.push(trangThai);
        }

        sql += ' GROUP BY dm.ma_danh_muc, dm.ten_danh_muc, dm.mo_ta, dm.trang_thai';
        sql += ' ORDER BY dm.ma_danh_muc ASC';

        const [rows] = await pool.query(sql, params);

        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Lỗi getDanhSachDanhMuc:', error.message);
        res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách danh mục' });
    }
};

// ===== POST /api/admin/danh-muc =====
// Thêm danh mục mới, tự sinh mã DM0001, DM0002, ...
const themDanhMuc = async (req, res) => {
    try {
        const { ten_danh_muc, mo_ta, trang_thai } = req.body;

        if (!ten_danh_muc || ten_danh_muc.trim() === '') {
            return res.status(400).json({ success: false, message: 'Tên danh mục không được để trống' });
        }

        // Tự sinh mã danh mục
        const [maxRow] = await pool.query('SELECT MAX(ma_danh_muc) AS maxId FROM danhmuc');
        let ma_danh_muc = 'DM0001';
        if (maxRow[0].maxId) {
            const currentNum = parseInt(maxRow[0].maxId.replace('DM', ''), 10);
            ma_danh_muc = 'DM' + (currentNum + 1).toString().padStart(4, '0');
        }

        await pool.query(
            'INSERT INTO danhmuc (ma_danh_muc, ten_danh_muc, mo_ta, trang_thai) VALUES (?, ?, ?, ?)',
            [ma_danh_muc, ten_danh_muc.trim(), mo_ta ? mo_ta.trim() : '', trang_thai || 'hoat-dong']
        );

        res.status(201).json({
            success: true,
            message: 'Thêm danh mục thành công',
            data: { ma_danh_muc },
        });
    } catch (error) {
        console.error('Lỗi themDanhMuc:', error.message);
        res.status(500).json({ success: false, message: 'Lỗi server khi thêm danh mục' });
    }
};

// ===== PUT /api/admin/danh-muc/:id =====
// Cập nhật danh mục theo ma_danh_muc
const capNhatDanhMuc = async (req, res) => {
    try {
        const { id } = req.params;
        const { ten_danh_muc, mo_ta, trang_thai } = req.body;

        if (!ten_danh_muc || ten_danh_muc.trim() === '') {
            return res.status(400).json({ success: false, message: 'Tên danh mục không được để trống' });
        }

        const [existing] = await pool.query('SELECT ma_danh_muc FROM danhmuc WHERE ma_danh_muc = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục này' });
        }

        const [result] = await pool.query(
            'UPDATE danhmuc SET ten_danh_muc = ?, mo_ta = ?, trang_thai = ? WHERE ma_danh_muc = ?',
            [ten_danh_muc.trim(), mo_ta ? mo_ta.trim() : '', trang_thai || 'hoat-dong', id]
        );

        if (result.affectedRows === 0) {
            return res.status(400).json({ success: false, message: 'Không có thay đổi nào được thực hiện' });
        }

        res.json({ success: true, message: 'Cập nhật danh mục thành công' });
    } catch (error) {
        console.error('Lỗi capNhatDanhMuc:', error.message);
        res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật danh mục' });
    }
};

// ===== DELETE /api/admin/danh-muc/:id =====
// Xóa danh mục (chặn nếu còn thiết bị liên kết)
const xoaDanhMuc = async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await pool.query('SELECT ma_danh_muc FROM danhmuc WHERE ma_danh_muc = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục này' });
        }

        // Kiểm tra còn thiết bị thuộc danh mục này không
        const [thietBiRows] = await pool.query(
            'SELECT COUNT(*) AS so_luong FROM thietbi WHERE id_danhmuc = ?',
            [id]
        );
        if (thietBiRows[0].so_luong > 0) {
            return res.status(409).json({
                success: false,
                message: `Không thể xóa! Danh mục đang có ${thietBiRows[0].so_luong} thiết bị. Vui lòng chuyển thiết bị sang danh mục khác trước.`,
            });
        }

        await pool.query('DELETE FROM danhmuc WHERE ma_danh_muc = ?', [id]);

        res.json({ success: true, message: 'Xóa danh mục thành công' });
    } catch (error) {
        console.error('Lỗi xoaDanhMuc:', error.message);
        res.status(500).json({ success: false, message: 'Lỗi server khi xóa danh mục' });
    }
};

module.exports = { getDanhSachDanhMuc, themDanhMuc, capNhatDanhMuc, xoaDanhMuc };
