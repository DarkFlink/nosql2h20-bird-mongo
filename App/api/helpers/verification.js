const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const jwtConfig = require('../config/jwtConfig');

module.exports = (req, res, next) => {
  if (req.url === '/login/' || req.url === '/register/') {
    next();
  } else {
    const token = req.headers.token;
    if (!token) {
      res.status(400).send({
        error: 'no token provided'
      });
    }
    jwt.verify(token, jwtConfig.secret, (err, decoded) => {
      User.findOne({ _id: decoded._id }, (err, user) => {
        if (err) {
          res.status(400).send({
            error: 'invalid token'
          });
        }
        if (user) {
          req.userFromToken = user;
          next();
        }
      });

    });
  }
}
