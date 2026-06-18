const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile } = require('../controller/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.route('/profile')
  .get(protect, getProfile)
  .put(protect, updateProfile);

module.exports = router;
