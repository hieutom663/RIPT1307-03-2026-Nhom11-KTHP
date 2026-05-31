const express = require('express');
const router = express.Router();
const NotificationoController = require('../controllers/notification.controller');

router.get('/', NotificationoController.getDanhSachThongBaoAdmin);

router.put('/doc-tat-ca', NotificationoController.danhDauDocTatCa);

router.get('/user', NotificationoController.getDanhSachThongBaoUser);

router.put('/user/doc-tat-ca', NotificationoController.danhDauDocTatCaUser);

router.put('/:id/da-doc', NotificationoController.danhDauDaDoc);

module.exports = router;