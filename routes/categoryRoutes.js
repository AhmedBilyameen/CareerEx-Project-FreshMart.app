const express = require('express')
const router = express.Router()
const { createCategory, getAllCategories } = require('../controllers/categoryController')
const { protect, admin } = require('../middleware/authMiddleware')

router.post('/create', protect, admin, createCategory)
router.get('/', getAllCategories)


module.exports = router
