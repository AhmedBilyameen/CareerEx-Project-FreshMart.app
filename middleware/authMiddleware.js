const jwt = require('jsonwebtoken')
const User = require('../models/User')

exports.protect = async (req, res, next) => {

  let token = req.headers.authorization?.split(' ')[1]

  if (!token) return res.status(401).json({ message: 'Not authorized, no token' })

  try {

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN)

    req.user = await User.findById(decoded.id).select('-password')
    next()

  } catch (err) {

    res.status(401).json({ message: 'Not authorized, token failed' })

  }
};

exports.admin = (req, res, next) => {

  if (req.user && req.user.role === 'admin') {
    
    return next()

  } else {
    return res.status(403).json({ message: 'Access denied, admin only' })
  }
};
