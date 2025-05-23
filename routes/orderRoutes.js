const express = require('express');
const router = express.Router();
const { placeOrder, getUserOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create', protect, placeOrder);
router.get('/my-orders', protect, getUserOrders);
//view all orders by user ID

module.exports = router;
