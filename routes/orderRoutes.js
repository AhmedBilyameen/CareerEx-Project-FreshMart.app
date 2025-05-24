const express = require('express');
const router = express.Router();
const { 
    placeOrder, 
    getUserOrders, 
    getOrdersByUserId,
    markOrderAsPaid,
    updateOrderStatus,
    cancelOrder,
    getAllOrders
} = require('../controllers/orderController');
const { protect, admin} = require('../middleware/authMiddleware');

router.get('/', protect, admin, getAllOrders) 
router.post('/create', protect, placeOrder)
router.get('/my-orders', protect, getUserOrders)
router.get('/:userId', protect, admin, getOrdersByUserId) //view all orders by user ID admin only

// Mark as paid
router.put('/:id/pay', protect, markOrderAsPaid);
// Update status
router.put('/:id/status', protect, admin, updateOrderStatus);
// Cancel order
router.put('/:id/cancel', protect, cancelOrder);


module.exports = router;
