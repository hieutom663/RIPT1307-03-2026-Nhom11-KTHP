const express = require('express');
const router = express.Router();
const thongBaoController = require('../controllers/notification.controller');

router.get('/admin', thongBaoController.getDanhSachThongBaoAdmin);
router.put('/admin/:id/da-doc', thongBaoController.danhDauDaDoc);
router.put('/admin/doc-tat-ca', thongBaoController.danhDauDocTatCa);
router.get('/user', thongBaoController.getDanhSachThongBaoUser);
router.put('/user/doc-tat-ca', thongBaoController.danhDauDocTatCaUser);

module.exports = router;