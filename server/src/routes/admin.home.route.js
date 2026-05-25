const express = require('express');
const router = express.Router();
const adminHomeController = require('../controllers/admin.home.controller');

// GET: /api/admin/trang-chu
router.get('/', adminHomeController.getAdminHome);

module.exports = router;