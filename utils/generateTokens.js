const jwt = require('jsonwebtoken');

exports.generateAccessToken = (user) => {
  return jwt.sign({ id: user?._id, role: user?.role }, process.env.ACCESS_TOKEN, {
    expiresIn: '15m',
  });
};

exports.generateRefreshToken = (user) => {
  return jwt.sign({ id: user?._id }, process.env.REFRESH_TOKEN, {
    expiresIn: '7d',
  });
};
