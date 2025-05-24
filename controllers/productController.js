const Product = require('../models/Product')
const Category = require('../models/Category')

exports.createProduct = async (req, res) => {

  try {

    const product = await Product.create(req.body)

    res.status(201).json({
         message: 'Product created', 
         product 
        })

  } catch (error) {

    res.status(500).json({ message: error.message })

  }
}

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
    res.json({ count : products.length, products })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getProductById = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

//get products by category id 

// exports.getProductsByCategory = async (req, res) => {
//   const { category, search } = req.query;
//   let query = {};

//   // Optional category filter
//   if (category) {
//     query.category = category;
//   }

//   if (search) {
//     query.name = { $regex: search, $options: 'i' }; // case-insensitive search
//   }

//   try {

//     const products = await Product.find(query)
//       .populate('category')

//     res.status(200).json(products);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }

exports.getProductsByCategory = async (req, res) => {
  const { category } = req.query

  try {
    // find category by name
    const categoryDoc = await Category.findOne({ name: category })
    if (!categoryDoc) return res.status(404).json({ message: 'Category not found' })

    // find products with category ID
    const products = await Product.find({ category: categoryDoc._id }).populate('category')
    res.status(200).json(products)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


