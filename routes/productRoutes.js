const express = require('express')
const router = express.Router()
// const { checkProductData } = require("../middleware/validation")
const { 
    createProduct,
    getAllProducts,
    getProductById,
    getProductsByCategory,
    deleteProduct,
    updateProduct
} = require('../controllers/productController')

const { protect, admin } = require('../middleware/authMiddleware')
const { productValidation } = require('../middleware/validation')
const validateResults = require('../middleware/validateResults')


router.get('/', getAllProducts)
router.post('/create', protect, admin, productValidation, validateResults, createProduct)
router.get('/by-category', getProductsByCategory)
router.get('/:id', getProductById)
router.put('/:id/edit', protect, admin, updateProduct);
router.delete('/:id/delete', protect, admin, deleteProduct);


module.exports = router
