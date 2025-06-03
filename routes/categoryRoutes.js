const express = require('express')
const router = express.Router()
const { createCategory, getAllCategories } = require('../controllers/categoryController')
const { protect, admin } = require('../middleware/authMiddleware')
const { categoryValidation } = require('../middleware/validation')
const validateResults = require('../middleware/validateResults')

router.post('/create', protect, admin, categoryValidation, validateResults, createCategory)
router.get('/', getAllCategories)


module.exports = router
