const express = require('express')
const router = express.Router()
const { 
    placeOrder, 
    // getOrdersByUserId,
    markOrderAsPaid,
    updateOrderStatus,
    cancelOrder,
    // getAllOrders,
    getAllOrdersAdmin
} = require('../controllers/orderController')

const { protect, admin} = require('../middleware/authMiddleware')
const { placeOrderValidation } = require('../middleware/validation')
const validateResults = require('../middleware/validateResults')

// router.get('/admin', protect, admin, getAllOrders) 
router.get('/admin', protect, admin, getAllOrdersAdmin)// to admin route next time
router.post('/create', protect, placeOrderValidation, validateResults, placeOrder)
// Mark as paid
router.put('/:id/pay', protect, admin, markOrderAsPaid)
// Update order status
router.put('/:id/status', protect, admin, updateOrderStatus)
// Cancel order
router.put('/:id/cancel', protect, cancelOrder)


module.exports = router
