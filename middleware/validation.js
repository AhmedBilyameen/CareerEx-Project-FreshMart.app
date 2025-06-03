const { body } = require('express-validator');

exports.registerValidation = [

  body('firstName')
    .notEmpty().withMessage('Firstname is required'),

  body('lastName')
    .notEmpty().withMessage('Lastname is required'),

  body('phoneNo')
    .notEmpty().withMessage('Phone Number is required')
    .isLength({ min: 11, max: 11}).withMessage('Phone number must be 11 digits')
    .matches(/^\d{11}$/).withMessage('Numbers only'),

  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/[A-Z]/).withMessage('Must contain an uppercase letter')
    .matches(/\d/).withMessage('Must contain a number')
    .matches(/[^A-Za-z0-9]/).withMessage('Must contain a special character')
];

exports.loginValidation = [

  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email'),

  body('password')
    .notEmpty().withMessage('Password is required')

];

exports.forgotPasswordValidation = [
  body('email', 'Please provide a valid email').isEmail(),
];

exports.resetPasswordValidation = [
  body('password', 'Password must be strong')
    .isLength({ min: 6 })
    .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/),
];

//productValidation
exports.productValidation = [
  body('name')
    .notEmpty()
    .withMessage('Product name is required'),

  body('price')
    .isFloat({ gt: 0 })
    .withMessage('Price must be a number greater than 0'),

  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),

  body('category')
    .notEmpty()
    .withMessage('Category is required'),
];

//orderValidation
exports.placeOrderValidation = [
  // Ensure orderItems is an array and not empty
  body('orderItems')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),

  // Validate each item in orderItems
  body('orderItems.*.product')
    .notEmpty()
    .withMessage('Product ID is required for each item'),

  body('orderItems.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1 for each item'),

  // Shipping address fields
  body('shippingAddress.address')
    .notEmpty()
    .withMessage('Shipping address is required'),

  body('shippingAddress.city')
    .notEmpty()
    .withMessage('City is required'),

  body('shippingAddress.postalCode')
    .notEmpty()
    .withMessage('Postal code is required'),

  body('shippingAddress.country')
    .notEmpty()
    .withMessage('Country is required'),

  // Payment method
  body('paymentMethod')
    .notEmpty()
    .withMessage('Payment method is required'),

  // Optional but strict if provided
  body('status')
    .optional()
    .isIn(['pending', 'processing', 'completed', 'cancelled'])
    .withMessage('Invalid status type'),
];
//categoryValidation
exports.categoryValidation = [
  body('name')
    .notEmpty()
    .withMessage('Category name is required'),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
];
//userValidation





















































































// exports.checkProductData = async (req, res, next) => {
//     // const { title, price, description, category, image } = req.body;
  
//     const errors = [];
//     // for..in, for..of, for..each
//     for(const key in req.body){
//       if(!req.body[key]){
//         errors.push(`Please add product ${key}.`)
//       }
//     }
//     // Object.entries(req.body).forEach(([key, value]) => {
//     //   if(!value){
//     //     errors.push(`Please add product ${key}.`)
//     //   }
//     // })
  
//     // for (const key of Object.keys(req.body)) {
//     //   // console.log(key, req.body[key]);
//     //   if(!req.body[key]){
//     //     errors.push(`Please add product ${key}.`)
//     //   }
//     // }
  
//     if(errors.length > 0)
//       return res.status(401).json({msg: errors})
  
//     next();
//   }