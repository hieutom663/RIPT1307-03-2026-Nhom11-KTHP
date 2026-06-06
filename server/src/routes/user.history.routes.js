const express = require('express');
const router = express.Router();
const historyController = require('../controllers/user.history.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.post('/thong-ke', historyController.getThongKeCaNhan);
router.post('/phieu-muon', historyController.getPhieuMuon);
router.post('/chi-tiet', historyController.getChiTietLichSu);

module.exports = router;