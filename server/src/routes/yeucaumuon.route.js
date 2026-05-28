const express = require('express');
const router = express.Router();
const yeuCauMuonController = require('../controllers/yeucaumuon.controller');

// GET: /api/admin/yeu-cau-muon - Lấy danh sách yêu cầu mượn
router.get('/', yeuCauMuonController.getDanhSachYeuCau);

// PUT: /api/admin/yeu-cau-muon/:maYC/duyet - Duyệt yêu cầu
router.put('/:maYC/duyet', yeuCauMuonController.duyetYeuCau);

// PUT: /api/admin/yeu-cau-muon/:maYC/tu-choi - Từ chối yêu cầu
router.put('/:maYC/tu-choi', yeuCauMuonController.tuChoiYeuCau);

module.exports = router;
