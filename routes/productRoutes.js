const express = require('express')
const router = express.Router()
// const { checkProductData } = require("../middleware/validation")
const { 
    createProduct,
    getAllProducts,
    getProductById,
    getProductsByCategory
} = require('../controllers/productController')

const { protect, admin } = require('../middleware/authMiddleware')


router.get('/', getAllProducts)
router.post('/create', protect, admin, createProduct)
router.get('/by-category', getProductsByCategory)
router.get('/:id', getProductById)

module.exports = router
