const Category = require('../models/Category')

exports.createCategory = async (req, res) => {

  try {
    const category = await Category.create(req.body)

    res.status(201).json({ 
        message: 'Category created', 
        category 
    })

  } catch (err) {

    res.status(500).json({ message: err.message })
    
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
