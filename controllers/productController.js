const Product = require('../models/Product')
// const Category = require('../models/Category')

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
    const { keyword } = req.query

    const query = {}

    if (keyword){
      query.name = { $regex: keyword, $options: 'i' }
    }

    const products = await Product.find(query)
    if (products.length === 0) {
      return res.status(404).json({message: 'No products found'})
    }
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

//get products by category id (numbers) and a search keyword
exports.getProductsByCategory = async (req, res) => {
  const { category, search } = req.query;
  let query = {};

  // Optional category filter
  if (category) {
    query.category = category;
  }

  if (search) {
    query.name = { $regex: search, $options: 'i' }; // case-insensitive search
  }

  try {

    const products = await Product.find(query)
      .populate('category')

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
//get products by category name (string)
// exports.getProductsByCategory = async (req, res) => {
//   const { category } = req.query

//   try {
//     // find category by name
//     const categoryDoc = await Category.findOne({ name: category })
//     if (!categoryDoc) return res.status(404).json({ message: 'Category not found' })

//     // find products with category ID
//     const products = await Product.find({ category: categoryDoc._id }).populate('category')
//     res.status(200).json(products)

//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// }

exports.updateProduct = async (req, res) => {
  try {
    const { name, price, description, inStock, stock, category, image } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Update only fields provided
    if (name) product.name = name;
    if (price) product.price = price;
    if (description) product.description = description;
    if (inStock) product.inStock = inStock;
    if (stock !== undefined) product.stock = stock;
    if (category) product.category = category;
    if (image) product.image = image;

    const updatedProduct = await product.save();
    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById( id )
    if (!product) return res.status(404).json({ message: 'Product not found'})


    await product.deleteOne()
    res.status(200).json({ message: 'Product deleted successfully' })

  } catch (error) {
    res.status(500).json({ message : 'server error', error : error.message})
  }
}

exports.getLowStockProducts = async (req, res) => {
  try {
    const threshold = Number(req.query.threshold) || 100;

    const lowStockProducts = await Product.find({ stock: { $lt: threshold } })
      .select('name stock price category') // minimal fields
      .sort({ stock: 1 })

    res.status(200).json({
      count: lowStockProducts.length,
      threshold,
      products: lowStockProducts,
    })

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}



