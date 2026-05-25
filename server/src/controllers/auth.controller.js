const pool = require('../config/db.config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Vui lòng nhập email và mật khẩu" });
        }

        const sql = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await pool.query(sql, [email]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Email không tồn tại" });
        }

        const user = rows[0];

        const isMatch = await bcrypt.compare(password, user.mat_khau);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Sai mật khẩu" });
        }

        const payload = {
            id: user.id,
            role: user.role
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

        delete user.password;
        
        res.status(200).json({
            success: true,
            message: "Đăng nhập thành công",
            token: token,
            user: user,
        });

    } catch (error) {
        console.error("Lỗi:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

module.exports = { login };