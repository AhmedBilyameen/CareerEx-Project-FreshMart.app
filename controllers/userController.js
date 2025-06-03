const User = require('../models/User')
const Order = require('../models/Order')
const bcrypt = require('bcryptjs')
const sendEmail = require("../utils/sendEmail")

// api for user dashboard - display total orders, total amount spends etc.

//view profile info
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(['-password', '-role'])
    // const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })

    res.status(200).json({ user })
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user profile', error: error.message })
  }
}

// user all placed orders (owner), use query to display pending and completed orders here
exports.getUserOrders = async (req, res) => {
    try {
      const { status, startDate, endDate } = req.query;
  
      // Build query object dynamically
      const query = { user: req.user._id };
  
      if (status) {
        const allowedStatuses = ['pending', 'completed', 'cancelled'];
        if (!allowedStatuses.includes(status.toLowerCase())) {
          return res.status(400).json({ message: 'Invalid status filter' });
        }
        query.status = status.toLowerCase();
      }
  
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) {
          query.createdAt.$gte = new Date(startDate);
        }
        if (endDate) {
          query.createdAt.$lte = new Date(endDate);
        }
      }
  
      const orders = await Order.find(query)
        .populate('orderItems.product', 'name price')
        .sort({ createdAt: -1 });
  
      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: 'No orders found for this user' });
      }
  
      res.status(200).json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong while fetching orders' });
    }
}  

// updateUserProfile
exports.updateUserProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
  
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.email = req.body.email || user.email;
      user.phoneNo = req.body.phoneNo || user.phoneNo;
  
      const updatedUser = await user.save();
  
      res.status(200).json({
        message: 'Profile updated successfully',
        user: {
          _id: updatedUser._id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
        }
      });
  
    } catch (error) {
      res.status(500).json({ message: 'Failed to update profile', error: error.message });
    }
}

// updatePasswordByLoggedInUser
exports.changeUserPassword = async (req, res) => {
  const { currentPassword, password } = req.body

  try {
    const user = await User.findById(req.user._id)

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' })
    }

    user.password = password
    await user.save()

      // Send email confirmation
      const emailMessage = `
      <p>This is a confirmation that your password was successfully changed on <strong>FreshMart</strong>.</p>
      <p>If you didn’t request this change, please contact our support team immediately.</p>
      <br>
      <p>— FreshMart Security Team</p>
    `;

    await sendEmail({
      name: user.firstName,
      email: user.email,
      subject: 'Password Changed Successfully – FreshMart',
      message: emailMessage,
    })

    res.status(200).json({ message: 'Password changed successfully and email confirmation sent' })

  } catch (error) {
    res.status(500).json({ message: 'Failed to change password', error: error.message })
  }
}




  