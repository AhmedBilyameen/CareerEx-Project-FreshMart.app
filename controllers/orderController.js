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
    const itemsPrice = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const taxPrice = parseFloat((0.1 * itemsPrice).toFixed(2)); // 10% tax
    const shippingPrice = itemsPrice > 100 ? 0 : 10; // Free shipping if total > 100
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

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
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
  
