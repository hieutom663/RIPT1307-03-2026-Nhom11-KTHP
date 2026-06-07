const express = require('express');
const router = express.Router();
const userProfileController = require('../controllers/user.profile.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.post('/trang-ca-nhan', userProfileController.getProfile);

router.post('/update', userProfileController.updateProfile);

router.post('/change-password', userProfileController.changePassword)

module.exports = router;