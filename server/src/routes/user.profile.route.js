const express = require('express');
const router = express.Router();
const userProfileController = require('../controllers/user.profile.controller');

// POST: /api/user/trang-ca-nhan
router.post('/trang-ca-nhan', userProfileController.getProfile);

router.post('/update', userProfileController.updateProfile);

router.post('/change-password', userProfileController.changePassword)

module.exports = router;