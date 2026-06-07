const express = require('express');
const router = express.Router();
const userEquipmentController = require('../controllers/user.equipments.controller');

const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.get('/thiet-bi', userEquipmentController.getDanhSachThietBi);

router.get('/thiet-bi/pho-bien', userEquipmentController.getThietBiPhoBien);

router.get('/thiet-bi/co-san', userEquipmentController.getThietBiSan);

router.get('/danh-muc', userEquipmentController.getTatCaDanhMuc);

router.post('/yeu-cau-muon', userEquipmentController.taoYeuCauMuon);

module.exports = router;