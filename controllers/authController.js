const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { id: user?._id, role: user?.role }, 
    process.env.ACCESS_TOKEN, 
    { expiresIn: '1d' });
};

exports.register = async (req, res) => {

  const { firstName, lastName, phoneNo, email, password, role } = req.body

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const user = await User.create({ firstName, lastName, phoneNo, email, password, role })

    res.status(201).json({
      message: 'User registered',
      userInfo: {
        Firstname: user?.firstName, 
        Lastname: user?.lastName, 
        PhoneNumber: user?.phoneNo,
        Email : user?.email
      },
      token: generateToken(user)
    });

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
};

exports.login = async (req, res) => {

  const { email, password } = req.body

  try {

    const user = await User.findOne({ email })

    if (!user || !(await user.matchPassword(password))) {

      return res.status(401).json({ message: 'Invalid email or password' })

    }

    res.json({
      message: 'Login successful',
      token: generateToken(user)
    });
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
};
