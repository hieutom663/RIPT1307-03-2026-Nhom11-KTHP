const express = require('express');
const router = express.Router();
const historyController = require('../controllers/history.controller');

// POST: /api/user/lich-su-muon
router.post('/thong-ke', historyController.getThongKeCaNhan);
router.post('/phieu-muon', historyController.getPhieuMuon);
router.post('/chi-tiet', historyController.getChiTietLichSu);

module.exports = router;