const Order = require('../models/Order')
const sendEmail = require('../utils/sendEmail')
const Product = require('../models/Product')

exports.getAllOrders = async (req, res) => {

    try {
        const orders = await Order.find().populate('user')
            .populate('orderItems')
            .populate('user', 'firstName lastName email phoneNo')
        
        res.status(200).json({ count: orders.length, orders })

        } catch (error) {
            res.status(500).json({ message: error.message })
            }        
} //ERROR HERE

// user all placed orders
exports.getUserOrders = async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user._id })
        .populate('orderItems.product', 'name price');
      
      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: 'No orders found for this user' });
      }
  
      res.status(200).json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong while fetching orders' });
    }
  }

exports.placeOrder = async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  try {

    let itemsPrice = 0

    for (const item of orderItems) {
        const product = await Product.findById(item.product);
        if (!product) {
          return res.status(404).json({ message: 'Product not found' });
        }
  
        itemsPrice += product.price * item.quantity;
      }
    itemsPrice = parseFloat(itemsPrice.toFixed(2))
    const taxPrice = parseFloat((0.1 * itemsPrice).toFixed(2)); // 10% tax
    const shippingPrice = itemsPrice > 100000 ? 0 : 10; // Free shipping if total > 100k
    const totalPrice = parseFloat((itemsPrice + taxPrice + shippingPrice).toFixed(2))

    // totalPrice = Number(totalPrice)

    const order = await Order.create({
      user: req.user._id, //
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
//sent noti. ur order with id is pending payment proceed to make a payment

// @desc    Get all orders by user ID (Admin only)
// @route   GET /api/orders/:userId
// @access  Private/Admin
exports.getOrdersByUserId = async (req, res) => {
    try {
      const orders = await Order.find({ user: req.params.userId })
        .populate('user', 'firstName lastName email')
        .populate('orderItems.product', 'name price');
  
      if (!orders.length) {
        return res.status(404).json({ message: 'No orders found for this user' });
      }
  
      res.status(200).json({ count: orders.length, orders });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

// @desc Mark order as paid
// @route PUT /api/orders/:id/pay
// @access Private/Admin or after payment webhook
exports.markOrderAsPaid = async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ message: 'Order not found' });
  
      order.isPaid = true;
      order.paidAt = new Date();
  
      const updatedOrder = await order.save();
  
      res.status(200).json({
        message: 'Order marked as paid',
        order: updatedOrder,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  

  // @desc Update order status (e.g., pending → processing → completed)
  // @route PUT /api/orders/:id/status
  // @access Private/Admin
  exports.updateOrderStatus = async (req, res) => {
    const { status } = req.body;
  
    const allowedStatuses = ['pending', 'processing', 'completed', 'cancelled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
  
    try {
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ message: 'Order not found' });
  
      order.status = status;
      const updatedOrder = await order.save();
  
      res.status(200).json({
        message: `Order status updated to "${status}"`,
        order: updatedOrder,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  // NOTI: your order with id has been paid and mark completed

// @desc Cancel an order
// @route PUT /api/orders/:id/cancel
// @access Private (user or admin)
exports.cancelOrder = async (req, res) => {
    try {
      const order = await Order.findById(req.params.id).populate('user')
  
      if (!order) return res.status(404).json({ message: 'Order not found' })
  
       // Check authorization, allow only the user(owner) or admin to cancel the order
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to cancel this order' })
    }
      // Only pending orders can be cancelled by users
      if (order.status !== 'pending' && req.user.role !== 'admin') {
        return res.status(400).json({ message: 'Only pending orders can be cancelled' });
      }


    // if (order.status === 'cancelled') {
    //     return res.status(400).json({ message: 'Order is already cancelled' });
    // }
  
      order.status = 'cancelled';
      order.isPaid = false;
      order.paidAt = null;
  
      const updatedOrder = await order.save();
    //   console.log(order.user.email)

        // 📨 Send Notification Email to User
        try {
            const emailMessage = `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    
                    <p>
                    We would like to inform you that your order with the ID 
                    <strong style="color: #2E86C1;">${order._id}</strong> has been 
                    <strong style="color: red;">cancelled</strong>.
                    </p>

                    <p>
                    If you did not authorize this cancellation or believe this was done in error, 
                    please contact our support team immediately so we can assist you further.
                    </p>

                    <p>
                    You can reach us by replying to this email or through the support section in your FreshMart account.
                    </p>

                    <br>

                    <p>Thank you for shopping with us.</p>
                    <p style="margin-top: 20px;">Warm regards,</p>
                    <p><strong>The FreshMart Team</strong></p>
                </div>
                `;


            await sendEmail({
            email: order.user.email,
            name : order.user.firstName,
            subject: 'Order Cancellation Notification',
            message: emailMessage
            })

        } catch (emailError) {
            console.error('Failed to send notification email:', emailError.message);
            // Don't stop execution if email fails
        }
  
      res.status(200).json({
        message: 'Order cancelled successfully',
        order: updatedOrder,
      });
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
  
  
  
