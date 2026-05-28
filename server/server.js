const express = require('express');
const cors = require('cors');
require('dotenv').config();

// db
const dbPool = require('./src/config/db.config'); 

// routes
const authRoutes = require('./src/routes/auth.route');
const adminHomeRoutes = require('./src/routes/admin.home.route');
const adminDanhMucRoutes = require('./src/routes/admin.danhmuc.route');
const userProfileRoutes = require('./src/routes/userprofile.route');
const equipmentRoutes = require('./src/routes/equipments.route');
const historyRoutes = require('./src/routes/history.routes');

const app = express();

app.use(cors());

app.use(express.json()); 

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({ message: "Chào mừng đến với Backend Hệ thống Quản lý Mượn Đồ Dùng!" });
});

app.use('/api/auth', authRoutes);

app.use('/api/admin/trang-chu', adminHomeRoutes);
app.use('/api/admin/danh-muc', adminDanhMucRoutes);

app.use('/api/user', userProfileRoutes);

app.use('/api', equipmentRoutes);

app.use('/api/lich-su-muon', historyRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`=================================`);
    console.log(`Server đang chạy tại cổng: ${PORT}`);
    console.log(`Link: http://localhost:${PORT}`);
    console.log(`=================================`);
});