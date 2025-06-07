const Order = require('../models/Order')
const Product = require('../models/Product')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const sendEmail = require('../utils/sendEmail')


//view admin dashboard [ total orders, Ravenues, users, products etc]
exports.getDashboardSummary = async (req, res) => {
  try {
    const [totalOrders, totalUsers, totalProducts] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments(),
      Product.countDocuments()
    ])

    const revenue = await Order.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' }
        }
      }
    ])

    const orderStats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])

    const formattedStats = orderStats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {})

    // Orders and Revenue by Month
    const stats = await Order.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' },
        }
      },
      { $sort: { '_id': 1 } }
    ])

    //Top-Selling Products
    const topProducts = await Order.aggregate([
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: '$orderItems.product',
          totalSold: { $sum: '$orderItems.quantity' },
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          name: '$product.name',
          totalSold: 1,
          stock: '$product.stock'
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ])

    res.status(200).json({
      totalOrders,
      totalRevenue: revenue[0]?.totalRevenue || 0,
      totalUsers,
      totalProducts,
      orderBreakdown: {
        pending: formattedStats['pending'] || 0,
        processing: formattedStats['processing'] || 0,
        completed: formattedStats['completed'] || 0,
        cancelled: formattedStats['cancelled'] || 0,
      },
      stats,
      topProducts
    });



  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard summary.', error: error.message });
  }
}

//view profile info
exports.getAdminProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select(['-password', '-role'])
      // const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
  
      res.status(200).json({ user })
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch user profile', error: error.message })
    }
}

  // updateUserProfile
exports.updateAdminProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
  
      if (!user) return res.status(404).json({ message: 'Admin not found' });
  
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

// updatePasswordByLoggedInAdmin
exports.changeAdminPassword = async (req, res) => {
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
