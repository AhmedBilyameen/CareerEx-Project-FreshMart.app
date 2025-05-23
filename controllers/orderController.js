const Order = require('../models/Order');
const Product = require('../models/Product');

exports.getUserOrders = async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user._id }).populate('orderItems.product', 'name price');
      
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
  
  
