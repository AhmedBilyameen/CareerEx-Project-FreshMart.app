const express = require('express');
const router = express.Router();
const jwt = require(`jsonwebtoken`)
const { register, login, forgotPassword, resetPassword } = require('../controllers/authController');
const { 
        registerValidation,    
        loginValidation ,
        forgotPasswordValidation,
        resetPasswordValidation
    } = require('../middleware/validation')

const validateResult = require('../middleware/validateResults');
const User = require('../models/User');
const { generateAccessToken } = require("../utils/generateTokens")



router.post('/register', registerValidation, validateResult, register);
router.post('/login', loginValidation, validateResult, login);

router.post('/forgot-password', forgotPasswordValidation, validateResult, forgotPassword);
router.patch('/reset-password/:token', resetPasswordValidation, validateResult, resetPassword);

// Refresh token route
router.post('/refresh-token', async (req, res) => {

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

      console.log('Cookies:', req.cookies);
      console.log('Refresh token from cookie:', req.cookies.refreshToken);

    } catch (err) {
      res.status(401).json({ message: 'Refresh token expired or invalid', error: err.message });
    }
  });
  
  // Logout route
router.post('/logout', async (req, res) => {

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
});

module.exports = router;

