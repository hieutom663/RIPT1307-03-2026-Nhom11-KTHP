const express = require('express');
const router = express.Router();
const adminUsersController = require('../controllers/admin.users.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');

router.use(authMiddleware, authorize(['admin']));

router.get('/', adminUsersController.layDanhSachNguoiDung);

router.get('/:maSV', adminUsersController.xemChiTietNguoiDung);

router.post('/', adminUsersController.themNguoiDung);

router.put('/:maSV', adminUsersController.suaNguoiDung);

router.delete('/:maSV', adminUsersController.xoaNguoiDung);

module.exports = router;
