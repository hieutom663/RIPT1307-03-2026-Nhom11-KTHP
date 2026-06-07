const express = require('express');
const router = express.Router();
const adminHomeController = require('../controllers/admin.home.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');

router.use(authMiddleware, authorize(['admin']));

router.get('/', adminHomeController.getAdminHome);

module.exports = router;