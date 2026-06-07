const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const helmet = require('helmet');          
const morgan = require('morgan');          
const compression = require('compression');
require('dotenv').config();

const thongBaoController = require('./src/controllers/notification.controller');
const dbPool = require('./src/config/db.config');

// Routes
const authRoutes = require('./src/routes/auth.route');
const adminHomeRoutes = require('./src/routes/admin.home.route');
const adminDanhMucRoutes = require('./src/routes/admin.danhmuc.route');
const userProfileRoutes = require('./src/routes/user.profile.route');
const userEquipmentRoutes = require('./src/routes/user.equipments.route');
const adminEquipmentRoutes = require('./src/routes/admin.equipments.route');
const historyRoutes = require('./src/routes/user.history.routes');
const yeuCauMuonRoutes = require('./src/routes/yeucaumuon.route');
const thongKeRoutes = require('./src/routes/admin.thongke.route');
const adminHistoryRoutes = require('./src/routes/admin.history.route');
const adminUsersRoutes = require('./src/routes/admin.users.route');
const notificationRoutes = require('./src/routes/notification.route');

const app = express();

app.use(helmet());      
app.use(compression()); 
app.use(morgan('dev')); 

app.use(cors());
const corsOptions = {
    origin: ['http://localhost:8000', 'https://ptitborrow.netlify.app'],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/admin/trang-chu', adminHomeRoutes);
app.use('/api/admin/danh-muc', adminDanhMucRoutes);
app.use('/api/user', userProfileRoutes);
app.use('/api', userEquipmentRoutes);
app.use('/api/admin', adminEquipmentRoutes);
app.use('/api/lich-su-muon', historyRoutes);
app.use('/api/admin/lich-su', adminHistoryRoutes);
app.use('/api/admin/nguoi-dung', adminUsersRoutes);
app.use('/api/admin/thong-ke', thongKeRoutes);
app.use('/api/admin/yeu-cau-muon', yeuCauMuonRoutes);
app.use('/api/thong-bao', notificationRoutes);

app.use((err, req, res, next) => {
    console.error(`[Error]: ${err.stack}`);
    res.status(500).json({ 
        success: false, 
        message: 'Hệ thống đang gặp sự cố, vui lòng thử lại sau!' 
    });
});

cron.schedule('0 8 * * *', () => {
    console.log('[Cron] Đang quét đơn sắp đến hạn & quá hạn...');
    thongBaoController.thongBaoQuaHan();
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`=================================`);
    console.log(`Server chạy tại: http://localhost:${PORT}`);
    console.log(`=================================`);
});