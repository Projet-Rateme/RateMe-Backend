'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: false
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true
  },
  password: {
    type: String
  },
  image: {
    type: String
  },
  followers : {
    type: Array
  },
  following : {
    type: Array
  },
  isVerified : {
    type: Boolean,
    default: false
  },
  posts : [
    {
    type: mongoose.Schema.Types.ObjectId,ref:'Post'
    }
  ],
  ratings: [
    { user : mongoose.Schema.Types.ObjectId, stars : Number }
  ],
  stories: [
    {
    type: mongoose.Schema.Types.ObjectId,ref:'Story'
    }
  ],

}, {
  timestamps: true
});

UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.hash_password);
};

module.exports = mongoose.model('User', UserSchema);