const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlenght: 2,
    maxlenght: 30,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.ObjectId,
    required: true,
  },
  likes: [
    {
      type: mongoose.ObjectId,
    },
  ],
  createdAt: {
    type: Date,
  },
});

module.exports = mongoose.model('card', cardSchema);
