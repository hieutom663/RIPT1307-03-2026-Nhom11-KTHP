const express = require('express');
const router = express.Router();
const adminHistoryController = require('../controllers/admin.history.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');

router.use(authMiddleware, authorize(['admin']));


router.get('/cho-giao', adminHistoryController.layDanhSachChoGiao);

router.get('/dang-muon', adminHistoryController.layDanhSachDangMuon);

router.put('/cho-muon/:maYC', adminHistoryController.ghiNhanChoMuon);

router.put('/da-tra/:maYC', adminHistoryController.ghiNhanDaTra);

router.post('/thong-ke', adminHistoryController.getThongKeLichSu);

router.post('/phieu-muon', adminHistoryController.getAllPhieuMuon);

router.post('/chi-tiet', adminHistoryController.getAllChiTietLichSu);

module.exports = router;