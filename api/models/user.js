'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  firstname: {
    type: String,
    required: true,
    trim: true
  },
  lastname: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  profilePicture: {
    type: String,
    default: 'https://res.cloudinary.com/dzqjxjx8p/image/upload/v1523625008/blank-profile-picture-973460_960_720.png'
  },
  coverPicture: {
    type: String,
    default: 'https://res.cloudinary.com/dzqjxjx8p/image/upload/v1523625008/blank-profile-picture-973460_960_720.png'
  },
  bio: {
    type: String,
    default: 'No bio yet'
  },
  location: {
    type: String,
    default: 'No location yet'
  },
  website: {
    type: String,
    default: 'No website yet'
  },
  birthday: {
    type: Date,
    default: Date.now
  },
  isVerified: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true
});


UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.hash_password);
};

module.exports = mongoose.model('User', UserSchema);