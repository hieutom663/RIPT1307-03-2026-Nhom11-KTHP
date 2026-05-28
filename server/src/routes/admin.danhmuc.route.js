const express = require('express');
const router = express.Router();
const adminDanhMucController = require('../controllers/admin.danhmuc.controller');

// GET    /api/admin/danh-muc          - Lấy danh sách (có filter trangThai)
router.get('/', adminDanhMucController.getDanhSachDanhMuc);

// POST   /api/admin/danh-muc          - Thêm mới danh mục
router.post('/', adminDanhMucController.themDanhMuc);

// PUT    /api/admin/danh-muc/:id      - Cập nhật danh mục theo mã
router.put('/:id', adminDanhMucController.capNhatDanhMuc);

// DELETE /api/admin/danh-muc/:id      - Xóa danh mục theo mã
router.delete('/:id', adminDanhMucController.xoaDanhMuc);

module.exports = router;
