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