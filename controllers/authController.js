const User = require('../models/User')
const jwt = require('jsonwebtoken')
const sendEmail = require('../utils/sendEmail')
const { generateAccessToken, generateRefreshToken } = require('../utils/generateTokens')
const crypto = require('crypto')

// const generateToken = (user) => {
//   return jwt.sign(
//     { id: user?._id, role: user?.role }, 
//     process.env.ACCESS_TOKEN, 
//     { expiresIn: '5h' });
// };

exports.register = async (req, res) => {

  const { firstName, lastName, phoneNo, email, password, role } = req.body

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const user = await User.create({ firstName, lastName, phoneNo, email, password, role })

    await sendEmail({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      subject: 'Welcome to FreshMart',
      message: '<p>Thanks for signing up at FreshMart!</p> <br>   Your account has been successfully created!',
      buttonLink: 'https://freshmart.com/dashboard',
      buttonText: 'Go to Dashboard',
    });

    const refreshToken = generateRefreshToken(user)
    user.refreshToken = refreshToken
    await user.save()

    res
      .cookie(`refreshToken`, refreshToken, {
        httpOnly: true,
        secure: false, // I will set this to true in production
        sameSite: `strict`,
        maxAge: 7 * 24 * 60 * 60 * 1000,  //for 7days
      })
      .status(201)
      .json({
        message: 'User registered',
        userInfo: {
          Firstname: user?.firstName, 
          Lastname: user?.lastName, 
          PhoneNumber: user?.phoneNo,
          Email : user?.email
        },
        accessToken: generateAccessToken(user)
      });

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.login = async (req, res) => {

  const { email, password } = req.body

  try {

    const user = await User.findOne({ email })

    if (!user || !(await user.matchPassword(password))) {

      return res.status(401).json({ message: 'Invalid email or password' })

    }

    const refreshToken = generateRefreshToken(user)
    user.refreshToken = refreshToken
    await user.save()

    res
      .cookie(`refreshToken`, refreshToken, {
        httpOnly: true,
        secure: false, // I will set this to true in production
        sameSite: `strict`,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: 'Login successful',
        token: generateAccessToken(user)
      });

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.forgotPassword = async (req, res) => {
  const { email } = req.body
  let user

  try {
    user = await User.findOne({ email })
    
    if (!user) return res.status(404).json({ message: 'User not found' })

    const resetToken = user.getResetPasswordToken()

    await user.save({ validateBeforeSave: false })

    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
    const text = `
      <h4>Your request to reset your password.</h4>
      <p>Click the link below to reset your password. This link is valid for 10 minutes:</p>
      <a href="${resetUrl}" style="color:blue;">Reset Password</a>
      <p>If you do not request this, you can ignore this email.</p>
    `;

    // await sendEmail({
    //   to: user.email,
    //   subject: 'Password Reset Request',
    //   html: message,
    // });

    try {
      await sendEmail({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        subject: 'Password Reset Request',
        message : text
      })

    } catch (error) {
      console.error('Failed to send email', error.message);
      return res.status(500).json({ message: 'Failed to send email' });
    }
    
    // console.log( resetToken )
    res.status(200).json({ message: 'Reset email sent successfully' });

  } catch (err) {
    console.error(err)
    if (user) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
    }
    res.status(500).json({ message: 'Email could not be sent' });
  }
}

exports.resetPassword = async (req, res) => {
  const resetToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

  try {
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpire: { $gt: Date.now() },
    })

    if (!user) return res.status(400).json({ message: 'Reset link has expired or is invalid. Please request a new one' });

    const { password } = req.body;
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful. You can now log in.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}

exports.logout = async (req, res) => {

  const token = req.cookies.refreshToken;
  
  if (!token) return res.sendStatus(204); // No content
  
  try {
      const user = await User.findOne({ refreshToken: token });
  
      if (user) {
      user.refreshToken = null;
      await user.save();
      }
      res.clearCookie('refreshToken').json({ message: 'Logged out successfully' });
  } catch {
      res.status(500).json({ message: 'Logout failed' });
  }
  }

exports.refreshToken = async (req, res) => {

  const token = req.cookies.refreshToken;

  if (!token) return res.status(401).json({ message: 'No refresh token' });

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN);

    const user = await User.findById(decoded.id)
    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const accessToken = generateAccessToken(user);
    res.json({ accessToken });

    // console.log('Cookies:', req.cookies);
    // console.log('Refresh token from cookie:', req.cookies.refreshToken);

  } catch (err) {
    res.status(401).json({ message: 'Refresh token expired or invalid', error: err.message });
  }
}

//login with google
//login with facebook
