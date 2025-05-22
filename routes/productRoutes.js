const express = require('express')
const router = express.Router()
// const { checkProductData } = require("../middleware/validation")
const { createProduct } = require('../controllers/productController')
const { protect, admin } = require('../middleware/authMiddleware')

router.post('/', protect, admin, createProduct)

module.exports = router
