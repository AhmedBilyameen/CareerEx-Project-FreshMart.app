const express = require('express')
const router = express.Router()
// const { checkProductData } = require("../middleware/validation")
const { 
    createProduct,
    getAllProducts,
    getProductById
} = require('../controllers/productController')

const { protect, admin } = require('../middleware/authMiddleware')

router.post('/create', protect, admin, createProduct)
router.get('/', getAllProducts)
router.get('/:id', getProductById)

module.exports = router
