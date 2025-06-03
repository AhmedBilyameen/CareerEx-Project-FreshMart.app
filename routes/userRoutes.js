const express = require("express")
const router = express.Router()
const { protect } = require("../middleware/authMiddleware")
const { 
    getUserProfile, 
    getUserOrders, 
    updateUserProfile, 
    changeUserPassword 
} = require("../controllers/userController")
const { resetPasswordValidation } = require("../middleware/validation")
const validateResults = require("../middleware/validateResults")



// routes/userRoutes.js
router.get('/profile', protect, getUserProfile)
router.get('/my-orders', protect, getUserOrders)
router.put('/profile', protect, updateUserProfile)
router.put('/change-password', protect, resetPasswordValidation, validateResults, changeUserPassword)


module.exports = router;
