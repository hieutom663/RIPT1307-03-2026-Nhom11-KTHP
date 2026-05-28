const mysql = require('mysql2/promise'); // Bắt buộc dùng '/promise' để hỗ trợ async/await
require('dotenv').config(); // Load biến môi trường

// Tạo Connection Pool (Hồ chứa kết nối)
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Nk123456789',
    database: process.env.DB_NAME || 'ptit_borrow',
    waitForConnections: true,
    connectionLimit: 10, // Giới hạn tối đa 10 kết nối đồng thời
    queueLimit: 0
});

// Hàm tự động kiểm tra kết nối ngay khi server khởi động
pool.getConnection()
    .then(connection => {
        console.log('Đã kết nối thành công tới MySQL Database!');
        connection.release();
    })
    .catch(err => {
        console.error('Lỗi kết nối Database. Hãy kiểm tra lại XAMPP/MySQL và file .env!');
        console.error('Chi tiết lỗi:', err.message);
    });

// Xuất pool ra để các Controller sử dụng
module.exports = pool;