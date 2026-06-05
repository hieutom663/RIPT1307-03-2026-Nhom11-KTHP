const express = require('express');
const router = express.Router();
const adminUsersController = require('../controllers/admin.users.controller');

// GET: Lấy danh sách người dùng
router.get('/', adminUsersController.layDanhSachNguoiDung);

// GET: Xem chi tiết người dùng
router.get('/:maSV', adminUsersController.xemChiTietNguoiDung);

// POST: Thêm người dùng
router.post('/', adminUsersController.themNguoiDung);

// PUT: Sửa người dùng
router.put('/:maSV', adminUsersController.suaNguoiDung);

// DELETE: Xóa người dùng
router.delete('/:maSV', adminUsersController.xoaNguoiDung);

module.exports = router;
