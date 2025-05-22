const express = require('express')
const router = express.Router()
const { createCategory } = require('../controllers/categoryController')
const { protect, admin } = require('../middleware/authMiddleware')

router.post('/', protect, admin, createCategory)

module.exports = router
