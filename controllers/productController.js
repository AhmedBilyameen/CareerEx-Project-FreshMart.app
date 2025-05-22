const Product = require('../models/Product')

exports.createProduct = async (req, res) => {

  try {

    const product = await Product.create(req.body)

    res.status(201).json({
         message: 'Product created', 
         product 
        })

  } catch (err) {

    res.status(500).json({ message: err.message })

  }
};
