const express = require('express');
const router = express.Router();
const thongKeController = require('../controllers/admin.thongke.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');

router.use(authMiddleware, authorize(['admin']));

router.get('/tong-quan', thongKeController.getThongKeTongQuan);

router.get('/top-thiet-bi', thongKeController.getTopThietBi);

router.get('/phan-bo-trang-thai', thongKeController.getPhanBoTrangThai);

module.exports = router;
