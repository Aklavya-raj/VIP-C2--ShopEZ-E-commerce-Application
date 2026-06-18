const express = require('express');
const router = express.Router();
const { getOrders, getStats } = require('../controller/adminController');
const { protect, admin } = require('../middleware/auth');

router.use(protect, admin);

router.get('/orders', getOrders);
router.get('/stats', getStats);

module.exports = router;
