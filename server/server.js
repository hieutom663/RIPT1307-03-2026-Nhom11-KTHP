const express = require('express');
const cors = require('cors');
require('dotenv').config();

// db
const dbPool = require('./src/config/db.config'); 

// routes
const authRoutes = require('./src/routes/auth.route');
const adminHomeRoutes = require('./src/routes/admin.home.route');
const adminDanhMucRoutes = require('./src/routes/admin.danhmuc.route');
const userProfileRoutes = require('./src/routes/user.profile.route');
const userEquipmentRoutes = require('./src/routes/user.equipments.route');
const adminEquipmentRoutes = require('./src/routes/admin.equipments.route');
const historyRoutes = require('./src/routes/user.history.routes');
const yeuCauMuonRoutes = require('./src/routes/yeucaumuon.route');
const thongKeRoutes = require('./src/routes/thongke.route');
const adminHistoryRoute = require('./src/routes/admin.history.route');

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

app.use('/api', userEquipmentRoutes);

app.use('/api/admin', adminEquipmentRoutes);

app.use('/api/lich-su-muon', historyRoutes);
app.use('/api/admin/lich-su-muon', adminHistoryRoute);
app.use('/api/admin/yeu-cau-muon', yeuCauMuonRoutes);
app.use('/api/admin/thong-ke', thongKeRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`=================================`);
    console.log(`Server đang chạy tại cổng: ${PORT}`);
    console.log(`Link: http://localhost:${PORT}`);
    console.log(`=================================`);
});