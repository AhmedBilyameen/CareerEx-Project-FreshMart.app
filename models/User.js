const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const crypto = require('crypto');

const userSchema = new mongoose.Schema({

  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNo: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  refreshToken: { type: String, default : "" },
  resetPasswordToken: { type : String, default : ""},
  resetPasswordExpire: Date

}, { timestamps : true })

// Hash password before saving
userSchema.pre('save', async function (next) {

  if (!this.isModified('password')) return next() // this will allow me to save just only new and changed password
  
    const salt = await bcrypt.genSalt(12)

    this.password = await bcrypt.hash(this.password, salt)
    next()
  })

// Password comparison method
userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password)
}

// Generate and hash password reset token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
}

const User = mongoose.model('User', userSchema)

module.exports= User
