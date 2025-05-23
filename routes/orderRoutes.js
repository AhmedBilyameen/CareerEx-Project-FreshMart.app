const express = require('express');
const router = express.Router();
const { 
    placeOrder, 
    getUserOrders, 
    getOrdersByUserId,
    markOrderAsPaid,
    updateOrderStatus
} = require('../controllers/orderController');
const { protect, admin} = require('../middleware/authMiddleware');

router.post('/create', protect, placeOrder);
router.get('/my-orders', protect, getUserOrders);
router.get('/:userId', protect, admin, getOrdersByUserId) //view all orders by user ID admin only

// Mark as paid
router.put('/:id/pay', protect, markOrderAsPaid);

// Update status
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
