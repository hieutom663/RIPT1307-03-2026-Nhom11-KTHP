const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool(process.env.DB_URL || {
    host: process.env.DB_HOST,
    user: process.env.DB_USER ,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, 
    queueLimit: 0
});

pool.getConnection()
    .then(connection => {
        console.log('Đã kết nối thành công tới MySQL Database trên mây!');
        console.log(process.env.DB_HOST, process.env.DB_USER, process.env.DB_NAME)
        connection.release();
    })
    .catch(err => {
        console.error('Lỗi kết nối Database:', err.message);
    });

module.exports = pool;