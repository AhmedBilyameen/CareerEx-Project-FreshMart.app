const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    name : { type : String, required : true},
    price : { type : Number, required : true},
    inStock : { type : Boolean, default : false},
    stock : { type : Number, default : 0},
    category : { type : mongoose.Schema.Types.ObjectId, ref : 'Category' },
    description : { type : String, default : ""},
    image : { type : String, default : ""}

}, { timestamps : true})

const Product = mongoose.model("Product", productSchema)

module.exports = Product

