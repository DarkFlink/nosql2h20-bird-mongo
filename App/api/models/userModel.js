const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  isAdmin: {
    type: Boolean,
    required: true
  },
  login: {
    unique: true,
    dropDups: true,
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  image: {
    type: String
  },
  description: {
    type: String
  },
  achievements: {
    type: [{ type: String }],
    select: false
  }
});

const User = module.exports = mongoose.model('User', userSchema);
