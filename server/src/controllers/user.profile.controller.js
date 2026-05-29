const pool = require('../config/db.config');
const bcrypt = require('bcryptjs');

const getProfile = async (req, res) => {
    try {
        const { ma_sv } = req.body;

        const [rows] = await pool.query(
            "SELECT ho_ten, email, so_phone AS soPhone, ma_sv AS maSV FROM users WHERE ma_sv = ?",
            [ma_sv]
        );

        if (rows.length === 0) return res.status(404).json({ success: false, message: "Không tìm thấy" });

        res.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error("Lỗi:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { ten, soPhone, ma_sv } = req.body;

        if (!ma_sv) {
            return res.status(400).json({ success: false, message: "Thiếu mã sinh viên" });
        }
        const [result] = await pool.query(
            "UPDATE users SET ho_ten = ?, so_phone = ? WHERE ma_sv = ?",
            [ten, soPhone, ma_sv]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy dữ liệu để cập nhật" });
        }

        res.json({ success: true, message: "Cập nhật thành công!" });
    } catch (error) {
        console.error("Lỗi:", error);
        res.status(500).json({ success: false, message: "Lỗi server khi cập nhật" });
    }
};

const changePassword = async (req, res) => {
    try {
        const { ma_sv, matKhauCu, matKhauMoi } = req.body;

        if (!ma_sv) {
            return res.status(400).json({ success: false, message: "Thiếu mã sinh viên" });
        }

        const [users] = await pool.query(
            "SELECT mat_khau FROM users WHERE ma_sv = ?",
            [ma_sv]
        );

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(matKhauCu, user.mat_khau);

        if (!isMatch) {
            return res.json({ success: false, message: "Mật khẩu cũ không đúng!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedMatKhauMoi = await bcrypt.hash(matKhauMoi, salt);

        const [result] = await pool.query(
            "UPDATE users SET mat_khau = ? WHERE ma_sv = ?",
            [hashedMatKhauMoi, ma_sv]
        );

        if (result.affectedRows === 0) {
            return res.status(400).json({ success: false, message: "Lỗi không thể cập nhật mật khẩu" });
        }

        res.json({ success: true, message: "Đổi mật khẩu thành công!" });

    } catch (error) {
        console.error("Lỗi:", error);
        res.status(500).json({ success: false, message: "Lỗi server khi đổi mật khẩu" });
    }
};

module.exports = { getProfile, updateProfile, changePassword };