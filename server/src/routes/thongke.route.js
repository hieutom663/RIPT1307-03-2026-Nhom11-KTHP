const express = require('express');
const router = express.Router();
const thongKeController = require('../controllers/thongke.controller');

// GET: /api/admin/thong-ke/tong-quan - Thống kê tổng quan
router.get('/tong-quan', thongKeController.getThongKeTongQuan);

// GET: /api/admin/thong-ke/top-thiet-bi - Top thiết bị mượn nhiều
router.get('/top-thiet-bi', thongKeController.getTopThietBi);

// GET: /api/admin/thong-ke/phan-bo-trang-thai - Phân bố trạng thái
router.get('/phan-bo-trang-thai', thongKeController.getPhanBoTrangThai);

module.exports = router;
