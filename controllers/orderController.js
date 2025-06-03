const Order = require('../models/Order')
const sendEmail = require('../utils/sendEmail')
const Product = require('../models/Product')

// exports.getAllOrders = async (req, res) => {

//     try {
//         const orders = await Order.find()
//             .populate('orderItems.product', 'name price')
//             .populate('user', 'firstName lastName email phoneNo')
        
//         res.status(200).json({ count: orders.length, orders })

//         } catch (error) {
//             res.status(500).json({ message: error.message })
//             }        
// }


/* @desc   Admin: Get all orders with optional filters--- All oreders, userId, status, dateRange,
 @route  GET /api/orders/admin
 @access Private/Admin*/
exports.getAllOrdersAdmin = async (req, res) => {
  try {
    const { status, user, startDate, endDate } = req.query
    let filter = {}

    // Filter by order status
    if (status) {
      filter.status = status
    }

    // Filter by user (by ID)
    if (user) {
      filter.user = user
    }

    // Optional: Date range filter
    if (startDate || endDate) {
      filter.createdAt = {}
      if (startDate) filter.createdAt.$gte = new Date(startDate)
      if (endDate) filter.createdAt.$lte = new Date(endDate)
    }

    const orders = await Order.find(filter)
      .populate('user', 'firstName lastName email phoneNo')
      .sort({ createdAt: -1 });

    res.status(200).json({ count: orders.length, orders })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.placeOrder = async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' })
  }

  try {

    let itemsPrice = 0
    const enrichedOrderItems = []

    for (const item of orderItems) {
        const product = await Product.findById(item.product)
          
        if (!product) {
          return res.status(404).json({ message: 'Product not found' })
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({ message: `Not enough stock for ${item.product}` })
        }

        // Calculate price
        const itemTotal = product.price * item.quantity
        itemsPrice += itemTotal

        // Reduce stock for each product
        product.stock -= item.quantity
        await product.save()

        // Add enriched item
        enrichedOrderItems.push({
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity
        })
      }
    itemsPrice = parseFloat(itemsPrice.toFixed(2))
    const taxPrice = parseFloat((0.1 * itemsPrice).toFixed(2)); // 10% tax
    const shippingPrice = itemsPrice > 100000 ? 0 : 10; // Free shipping if total > 100k
    const totalPrice = parseFloat((itemsPrice + taxPrice + shippingPrice).toFixed(2))
    
    //create order
    const order = await Order.create({
      user: req.user._id, //
      orderItems : enrichedOrderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    })

     // Construct email message
     const emailMessage = `
     <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
   
       <p>
         Thank you for placing an order with <strong style="color: #2E8B57;">FreshMart</strong>!<br>
         Your order <strong>#${order._id}</strong> has been successfully placed and is currently 
         <span style="color: orange;"><strong>pending payment</strong></span>.
       </p>
   
       <h3 style="margin-top: 30px;">🛒 Order Summary</h3>
       <table style="width: 100%; border-collapse: collapse;">
         <thead>
           <tr style="background-color: #f0f0f0;">
             <th align="left" style="padding: 8px;">Product</th>
             <th align="center" style="padding: 8px;">Quantity</th>
             <th align="right" style="padding: 8px;">Price</th>
             <th align="right" style="padding: 8px;">Subtotal</th>
           </tr>
         </thead>
         <tbody>
           ${enrichedOrderItems.map(item => `
             <tr>
               <td style="padding: 8px;">${item.name}</td>
               <td align="center" style="padding: 8px;">${item.quantity}</td>
               <td align="right" style="padding: 8px;">$${item.price.toFixed(2)}</td>
               <td align="right" style="padding: 8px;">$${(item.price * item.quantity).toFixed(2)}</td>
             </tr>
           `).join('')}
         </tbody>
       </table>
   
       <hr style="margin: 20px 0;">
   
       <p><strong>Items Total:</strong> $${itemsPrice.toFixed(2)}</p>
       <p><strong>Tax (10%):</strong> $${taxPrice.toFixed(2)}</p>
       <p><strong>Shipping:</strong> $${shippingPrice.toFixed(2)}</p>
       <p style="font-size: 18px; font-weight: bold; margin-top: 10px;">
         Total Amount: $${totalPrice.toFixed(2)}
       </p>
   
       <p style="margin-top: 20px;">
         🕒 <strong>Estimated Delivery:</strong> 3–5 business days after payment confirmation.
       </p>
   
       <p style="margin-top: 30px;">
         👉 <a href="https://your-payment-url.com" style="background-color: #2E8B57; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
           Click here to complete your payment
         </a>
       </p>
   
       <center><p style="margin-top: 30px;">
         If you didn’t place this order or need help, contact our support team immediately.
       </p></center>
   
       <br>
       <p style="color: #888;">— The FreshMart Team</p>
     </div>
   `;
   

   // Send email
   await sendEmail({
     name : req.user.firstName,
     email: req.user.email,
     subject: 'Order Confirmation - FreshMart',
     message: emailMessage,
   });

   res.status(201).json({
    message: 'Order placed successfully and email sent.',
    order,
  })

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
// @desc    Get all orders by user ID (Admin only)
// @route   GET /api/orders/:userId
// @access  Private/Admin
// exports.getOrdersByUserId = async (req, res) => {
//     try {
//       const orders = await Order.find({ user: req.params.userId })
//         .populate('user', 'firstName lastName email')
//         .populate('orderItems.product', 'name price');
  
//       if (!orders.length) {
//         return res.status(404).json({ message: 'No orders found for this user' });
//       }
  
//       res.status(200).json({ count: orders.length, orders });
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   }

// @desc Mark order as paid
// @route PUT /api/orders/:id/pay
// @access Private/Admin or after payment webhook

exports.markOrderAsPaid = async (req, res) => {
    try {
      const order = await Order.findById(req.params.id)
      if (!order) return res.status(404).json({ message: 'Order not found' })
  
      order.isPaid = true;
      order.paidAt = new Date()
  
      const updatedOrder = await order.save()
  
      res.status(200).json({
        message: 'Order marked as paid',
        order: updatedOrder,
      });
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
  // @desc Update order status (pending, processing, completed)
  // @route PUT /api/orders/:id/status
  // @access Private/Admin
exports.updateOrderStatus = async (req, res) => {
    const { status } = req.body;
  
    const allowedStatuses = ['pending', 'processing', 'completed'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
  
    try {
      const order = await Order.findById(req.params.id)
          .populate('user', 'firstName email')

      if (!order) return res.status(404).json({ message: 'Order not found' });
  
      order.status = status;
      const updatedOrder = await order.save()

      // Construct status-based email
    let emailMessage = '';

    if (status === 'processing') {
      emailMessage = `

        <p>We’ve received your payment for order <strong>#${order._id}</strong>. Your order is now being <strong>processed</strong>.</p>
        
        <p>Our team is preparing your items and we’ll notify you once your order is on the way.</p>
        
        <p>If you have any questions, feel free to reach out.</p>
        
        <br>
        <p>Thank you for shopping with us!</p>
        <p><strong>— The FreshMart Team</strong></p>
      
      `;
    } else if (status === 'completed') {
      emailMessage = `

        <p>We’re happy to let you know that your order <strong>#${order._id}</strong> has been <strong>delivered successfully</strong>.</p>
        
        <p>We hope everything arrived in great condition. Thank you for choosing FreshMart!</p>
        
        <p>If you have any feedback, we’d love to hear from you.</p>
        
        <br>
        <p>Warm regards,</p>
        <p><strong>— The FreshMart Team</strong></p>
      
      `;
    }

    // Send email if status is relevant
    if (emailMessage) {
      await sendEmail({
        name: order.user.firstName,
        email: order.user.email,
        subject: `Order Update - Status: ${status.toUpperCase()}`,
        message: emailMessage,
      }) 
    }

  
      res.status(200).json({
        message: `Order status updated to "${status}" and notification sent`,
        order: updatedOrder,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

// @desc Cancel an order
// @route PUT /api/orders/:id/cancel
// @access Private (user or admin)
exports.cancelOrder = async (req, res) => {
    const { id } = req.params
    const { status } = req.body

    try {
      const order = await Order.findById(id)
      .populate('user')
      .populate('orderItems.product')
  
      if (!order) return res.status(404).json({ message: 'Order not found' })
  
       // Check authorization, allow only the user(owner) or admin to cancel the order
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to cancel this order' })
    }
      // Only pending orders can be cancelled by user(owner) but admin can be able to cancelled other status orders
      if (order.status !== 'pending' && req.user.role !== 'admin') {
        return res.status(400).json({ message: 'Only pending orders can be cancelled' })
      }

    if (order.status === 'cancelled') {
        return res.status(400).json({ message: 'Order is already cancelled' })
    }

    const previousStatus = order.status;

    // Restore stock if status is changing to 'cancelled' and it was not previously cancelled
    if (status === 'cancelled' && previousStatus !== 'cancelled') {
      for (const item of order.orderItems) {
        const product = await Product.findById(item.product._id)

        if (product) {
          product.stock += item.quantity
          await product.save()
        }
      }
    }
  
      order.status = status
      order.isPaid = false
      order.paidAt = null
  
      const updatedOrder = await order.save()
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
            console.error('Failed to send notification email:', emailError.message)
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

  //updateOrder(Owner)... owner should be able to update his/her order
  //deleteOrder(admin) -- make sure the order to be deleted is a cancelled order
  


  
