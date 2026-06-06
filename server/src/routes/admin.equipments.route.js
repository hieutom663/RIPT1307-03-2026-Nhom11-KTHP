const express = require('express');
const router = express.Router();
const adminEquipmentController = require('../controllers/admin.equipments.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');

router.use(authMiddleware, authorize(['admin']));

router.get('/thiet-bi', adminEquipmentController.getDanhSachThietBi);

router.post('/thiet-bi', adminEquipmentController.themThietBi);

router.put('/thiet-bi/:id', adminEquipmentController.suaThietBi);

router.delete('/thiet-bi/:id', adminEquipmentController.xoaThietBi);

module.exports = router;
