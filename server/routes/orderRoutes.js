const express = require('express');
const router = express.Router();
const { addOrderItems, getMyOrders } = require('../controller/orderController');
const { protect } = require('../middleware/auth');

router.post('/', protect, addOrderItems);
router.get('/myorders', protect, getMyOrders);

module.exports = router;
