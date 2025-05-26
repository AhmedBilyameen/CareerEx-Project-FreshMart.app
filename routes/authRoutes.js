const express = require('express');
const router = express.Router();
const jwt = require(`jsonwebtoken`)
const { 
        register, 
        login, 
        forgotPassword, 
        resetPassword, 
        logout, 
        refreshToken 
} = require('../controllers/authController');
const { 
        registerValidation,    
        loginValidation ,
        forgotPasswordValidation,
        resetPasswordValidation
    } = require('../middleware/validation')

const validateResult = require('../middleware/validateResults');
const { protect } = require('../middleware/authMiddleware');
// const User = require('../models/User');
// const { generateAccessToken } = require("../utils/generateTokens")


router.post('/register', registerValidation, validateResult, register);
router.post('/login', loginValidation, validateResult, login);

router.post('/forgot-password', forgotPasswordValidation, validateResult, forgotPassword);
router.patch('/reset-password/:token', resetPasswordValidation, validateResult, resetPassword);
  // Logout route
router.post('/logout', protect, logout);

// Refresh token route
router.post('/refresh-token', refreshToken);
  


module.exports = router;

