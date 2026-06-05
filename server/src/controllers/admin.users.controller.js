const pool = require('../config/db.config');
const bcrypt = require('bcryptjs');

// Lấy danh sách tất cả người dùng
const layDanhSachNguoiDung = async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT ma_sv, ho_ten, email, so_phone, vai_tro FROM users ORDER BY ma_sv ASC"
        );

        res.json({ success: true, data: rows });
    } catch (error) {
        console.error("Lỗi layDanhSachNguoiDung:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

// Xem chi tiết 1 người dùng
const xemChiTietNguoiDung = async (req, res) => {
    try {
        const maSV = req.params.maSV;

        const [rows] = await pool.query(
            "SELECT ma_sv, ho_ten, email, so_phone, vai_tro FROM users WHERE ma_sv = ?",
            [maSV]
        );

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
        }

        res.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error("Lỗi xemChiTietNguoiDung:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

// Thêm người dùng mới
const themNguoiDung = async (req, res) => {
    try {
        const { ma_sv, ho_ten, email, so_phone, mat_khau, vai_tro } = req.body;

        if (!ma_sv || !ho_ten || !email || !mat_khau) {
            return res.status(400).json({ success: false, message: "Vui lòng nhập đầy đủ thông tin bắt buộc" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(mat_khau, salt);

        await pool.query(
            "INSERT INTO users (ma_sv, ho_ten, email, so_phone, mat_khau, vai_tro) VALUES (?, ?, ?, ?, ?, ?)",
            [ma_sv, ho_ten, email, so_phone || null, hashedPassword, vai_tro || 'user']
        );

        res.json({ success: true, message: "Thêm người dùng thành công" });
    } catch (error) {
        console.error("Lỗi themNguoiDung:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: "Mã SV hoặc email đã tồn tại" });
        }
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

// Sửa thông tin người dùng
const suaNguoiDung = async (req, res) => {
    try {
        const maSV = req.params.maSV;
        const { ho_ten, email, so_phone, vai_tro } = req.body;

        const [result] = await pool.query(
            "UPDATE users SET ho_ten = ?, email = ?, so_phone = ?, vai_tro = ? WHERE ma_sv = ?",
            [ho_ten, email, so_phone || null, vai_tro || 'user', maSV]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
        }

        res.json({ success: true, message: "Cập nhật thành công" });
    } catch (error) {
        console.error("Lỗi suaNguoiDung:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: "Email đã tồn tại" });
        }
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

// Xóa người dùng
const xoaNguoiDung = async (req, res) => {
    try {
        const maSV = req.params.maSV;

        // Kiểm tra xem người dùng có đơn mượn đang hoạt động không
        const [donMuon] = await pool.query(
            "SELECT COUNT(*) as count FROM yeucaumuon WHERE ma_nguoi_muon = ? AND trang_thai IN ('Chờ duyệt', 'Đang mượn')",
            [maSV]
        );

        if (donMuon[0].count > 0) {
            return res.status(400).json({
                success: false,
                message: "Không thể xóa người dùng đang có đơn mượn chưa hoàn thành"
            });
        }

        await pool.query("DELETE FROM users WHERE ma_sv = ?", [maSV]);

        res.json({ success: true, message: "Xóa người dùng thành công" });
    } catch (error) {
        console.error("Lỗi xoaNguoiDung:", error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({
                success: false,
                message: "Không thể xóa vì người dùng có liên kết dữ liệu (đơn mượn, thông báo...)"
            });
        }
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

module.exports = { layDanhSachNguoiDung, xemChiTietNguoiDung, themNguoiDung, suaNguoiDung, xoaNguoiDung };
