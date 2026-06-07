const express = require('express');
const router = express.Router();
const yeuCauMuonController = require('../controllers/yeucaumuon.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');

router.use(authMiddleware, authorize(['admin']));

router.get('/', yeuCauMuonController.getDanhSachYeuCau);

router.get('/:maYC/chi-tiet', yeuCauMuonController.getChiTietYeuCau);

router.put('/:maYC/duyet', yeuCauMuonController.duyetYeuCau);

router.put('/:maYC/tu-choi', yeuCauMuonController.tuChoiYeuCau);

router.put('/:maYC/tra-thiet-bi', yeuCauMuonController.xacNhanTraThietBi);

module.exports = router;
