const express = require('express');
const router = express.Router();

const adminHistoryController = require('../controllers/admin.history.controller');

router.post('/thong-ke', adminHistoryController.getThongKeAdmin);
router.post('/phieu-muon', adminHistoryController.getAllPhieuMuon);
router.post('/chi-tiet', adminHistoryController.getAllChiTietLichSu);

module.exports = router;