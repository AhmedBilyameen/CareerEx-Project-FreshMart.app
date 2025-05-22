const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    name : { type : String, required : true},
    price : { type : Number, required : true},
    inStock : { type : Boolean, default : false},
    category : { type : mongoose.Schema.Types.ObjectId, ref : 'Category' },
    description : { type : String, default : ""},
    image : String

}, { timestamps : true})

const Product = mongoose.model("Product", productSchema)

module.exports = Product

