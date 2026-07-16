const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, googleLogin } = require('../controller/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.route('/profile')
  .get(protect, getProfile)
  .put(protect, updateProfile);

module.exports = router;
