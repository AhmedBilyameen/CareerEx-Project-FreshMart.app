const express = require("express")
const router = express.Router()
const { protect, admin } = require("../middleware/authMiddleware")
const { 
    getAdminProfile, 
    updateAdminProfile, 
    changeAdminPassword,
    getDashboardSummary
} = require("../controllers/adminController")
const { resetPasswordValidation } = require("../middleware/validation")
const validateResults = require("../middleware/validateResults")



// routes/adminRoutes.js
router.get('/profile', protect, admin, getAdminProfile)
router.put('/profile', protect, admin, updateAdminProfile)
router.put('/change-password', protect, admin, resetPasswordValidation, validateResults, changeAdminPassword)
router.get('/dashboard-summary', protect, admin, getDashboardSummary)

module.exports = router
