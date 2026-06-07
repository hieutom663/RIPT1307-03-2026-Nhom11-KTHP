const express = require('express');
const router = express.Router();
const thongBaoController = require('../controllers/notification.controller');

const authMiddleware = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');

//admin
router.get('/admin', authMiddleware, authorize(['admin']), thongBaoController.getDanhSachThongBaoAdmin);
router.put('/admin/:id/da-doc', authMiddleware, authorize(['admin']), thongBaoController.danhDauDaDoc);
router.put('/admin/doc-tat-ca', authMiddleware, authorize(['admin']), thongBaoController.danhDauDocTatCa);

//user & admin
router.get('/user', authMiddleware, thongBaoController.getDanhSachThongBaoUser);
router.put('/user/doc-tat-ca', authMiddleware, thongBaoController.danhDauDocTatCaUser);

module.exports = router;