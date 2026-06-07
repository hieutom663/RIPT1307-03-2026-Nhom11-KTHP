const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool(process.env.DB_URI || {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ptit_borrow',
    waitForConnections: true,
    connectionLimit: 10, 
    queueLimit: 0
});

pool.getConnection()
    .then(connection => {
        console.log('Đã kết nối thành công tới MySQL Database trên mây!');
        connection.release();
    })
    .catch(err => {
        console.error('Lỗi kết nối Database:', err.message);
    });

module.exports = pool;