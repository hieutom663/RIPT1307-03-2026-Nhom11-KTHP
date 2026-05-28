const express = require('express');
const router = express.Router();
const adminHistoryController = require('../controllers/admin.history.controller');

// GET: Lấy danh sách chờ duyệt
router.get('/cho-duyet', adminHistoryController.layDanhSachChoDuyet);

// GET: Lấy danh sách đang mượn
router.get('/dang-muon', adminHistoryController.layDanhSachDangMuon);

// PUT: Ghi nhận cho mượn
router.put('/cho-muon/:maYC', adminHistoryController.ghiNhanChoMuon);

// PUT: Ghi nhận đã trả
router.put('/da-tra/:maYC', adminHistoryController.ghiNhanDaTra);

module.exports = router;
