const express = require('express');
const router = express.Router();
const adminDanhMucController = require('../controllers/admin.danhmuc.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');

router.use(authMiddleware, authorize(['admin']));

router.get('/', adminDanhMucController.getDanhSachDanhMuc);

router.post('/', adminDanhMucController.themDanhMuc);

router.put('/:id', adminDanhMucController.capNhatDanhMuc);

router.delete('/:id', adminDanhMucController.xoaDanhMuc);

module.exports = router;
