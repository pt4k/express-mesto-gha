const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlenght: 2,
    maxlenght: 30,
  },
  about: {
    type: String,
    required: true,
    minlenght: 2,
    maxlenght: 30,
  },
  avatar: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('user', userSchema);

module.exports = User;
