const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
// const bcrypt = require("bcryptjs")
// const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

//my routes dir.
const authRoutes = require('./routes/authRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const productRoutes = require('./routes/productRoutes')
const orderRoutes = require('./routes/orderRoutes')
const userRoutes = require('./routes/userRoutes')
const adminRoutes = require('./routes/adminRoutes')

// Load env variables
dotenv.config()
const app = express()

app.use(express.json())// Middleware to parse json body as json type
app.use(cookieParser())

//ROUTES--------------
app.use('/api/auth', authRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/users', userRoutes)
app.use('/api/admin', adminRoutes)

// Start server
const PORT = process.env.PORT || 7000;

// Connect to database
connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

// Basic route
app.get("/", (req, res) => {
    res.send("Welcome to CareeEx-FreshMart APP")
}) 

