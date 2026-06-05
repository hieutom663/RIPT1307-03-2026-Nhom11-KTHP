const express = require('express');
const router = express.Router();

const adminHistoryController = require('../controllers/admin.history.controller');

// GET: Lấy danh sách chờ giao
router.get('/cho-giao', adminHistoryController.layDanhSachChoGiao);

// GET: Lấy danh sách đang mượn
router.get('/dang-muon', adminHistoryController.layDanhSachDangMuon);

// PUT: Ghi nhận cho mượn
router.put('/cho-muon/:maYC', adminHistoryController.ghiNhanChoMuon);

// PUT: Ghi nhận đã trả
router.put('/da-tra/:maYC', adminHistoryController.ghiNhanDaTra);

// POST: Thống kê lịch sử (cho trang LichSuMuon)
router.post('/thong-ke', adminHistoryController.getThongKeLichSu);

// POST: Lấy tất cả phiếu mượn
router.post('/phieu-muon', adminHistoryController.getAllPhieuMuon);

// POST: Lấy chi tiết lịch sử
router.post('/chi-tiet', adminHistoryController.getAllChiTietLichSu);

module.exports = router;