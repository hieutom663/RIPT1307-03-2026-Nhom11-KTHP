const express = require('express');
const router = express.Router();
const adminEquipmentController = require('../controllers/admin.equipments.controller');

// GET: Lấy danh sách thiết bị
router.get('/thiet-bi', adminEquipmentController.layDanhSachThietBi);

// POST: Thêm thiết bị mới
router.post('/thiet-bi', adminEquipmentController.themThietBi);

// PUT: Sửa thiết bị
router.put('/thiet-bi/:id', adminEquipmentController.suaThietBi);

// DELETE: Xóa thiết bị
router.delete('/thiet-bi/:id', adminEquipmentController.xoaThietBi);

module.exports = router;
