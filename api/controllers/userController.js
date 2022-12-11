'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user.js');
const Post = require('../models/post.js');
const Story = require('../models/stories.js');
const Token = require('../models/token.js');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const multer = require("multer");
const SharpMulter  =  require("sharp-multer");
const path = require("path");
const cloudinary = require('cloudinary').v2;

const storage = SharpMulter({
  destination: (req, file, cb) => cb(null, "uploads"), // cb -> callback
  imageOptions:{
      quality: 80,
      resize: { width: 57, height: 57 },
        },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const handleMultipartData = multer({
  storage,
  limits: { fileSize: 1000000 * 5 },
}).single("image");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ratemeenoreply@gmail.com',
    pass: 'fszkwtsjfxhxnecx',
  },
});

module.exports = {
  // upload image and add to user
  uploadImage: async (req, res) => {
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return res.status(500).send({ error: err.message });
      }
      // get user from token in req.header.cookie
      const user = await User.findById(req.user.id);
      // get token from req.header.cookie
      const token = req.header('token');
      const result = await cloudinary.uploader.upload(req.file.path);
      user.image = result.secure_url;
      await user.save();
      return res.send({
        error: false,
        token: "test",
        message: 'Uploaded successfully',
        data: user,
      });
    });
  },
  
  register: async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.send({
        error: true,
        message: 'User Already Exists',
        data: []
      });
    }
    if (password !== confirmPassword) {
      return res.send({
        error: true,
        message: 'Password do not match',
        data: []
      });
    }

    const validEmail = (email) => {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    };

    if (!validEmail(email)) {
      return res.status(400).json({
        message: 'Invalid email',
      });
    }

    // hash password and create user
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hash,
    });

    const token = crypto.randomBytes(16).toString('hex');
    const newToken = await Token.create({
      userId: newUser._id,
      token,
    });

    const mailOptions = {
      from: '"Rate me" <ratemeenoreply@gmail.com>',
      to: email,
      subject: 'Verify your account',
      html: `<p>Hi ${name},</p>
      <p>Thank you for registering on Rate me!</p>
      <p>Please verify your account by clicking the link below:</p>
      http://localhost:3000/verify/${token}`
    };
    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        return res.status(400).json({
          message: 'Error sending email',
        });
      }
      return res.send({
        error: false,
        message: 'User successfully added',
        data: []
      });
    });
  },

  verify: async (req, res) => {
    const { tokens } = req.params;
    const token = await Token.findOne({
      token: tokens,
    });
    if (!token) {
      return res.status(400).json({
        message: 'Token is invalid',
      });
    }
    const user = await User.findById(token.userId);
    if (!user) {
      return res.status(400).json({
        message: 'User not found',
      });
    }
    if (user.isVerified) {
      return res.status(400).json({
        message: 'User already verified',
      });
    }
    user.isVerified = true;
    await user.save();
    return res.status(200).json({
      message: 'User verified',
    });
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.send({
        error: true,
        message : 'This email doesnt exist',
        token: '',
        data: null
      })
    }

    if (!await bcrypt.compare(password, user.password)) {
      return res.send ({
        error: true,
        message: 'Incorrect password',
        token: '',
        data: null
      });
    }

    if (!user.isVerified) {
      return res.send({
        error: true,
        message: 'Please verify your account',
        token: '',
        // return empty user data not in array
        data: null
      });
    }

    const token = jwt.sign({ id: user.id }, 'secret', {
      expiresIn: 86400,
    });

    // store token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    });

    return res.send({
      error: false,
      message: 'User successfully logged in',
      token: token,
      data: user,
    });

  },

  loginRequired: async (req, res, next) => {
    if (req.user) {
      next();
    }
    else {
      return res.status(401).json({ message: 'Unauthorized user!' });
    }

  },

  forgotPassword: async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: 'User not found',
      });
    }
    const token = crypto.randomBytes(16).toString('hex');
    const newToken = await Token.create({
      userId: user._id,
      token,
    });

    const mailOptions = {
      from: '"Rate me" <ratemeenoreply@gmail.com>',
      to: email,
      subject: 'Reset your password',
      html: `<p>Hi ${user.name},</p>
      <p>Someone has requested to reset your password.</p>
      <p>If it was not you, please ignore this email.</p>
      <p>If it was you, please click the link below to reset your password:</p>
      http://localhost:3000/resetpassword/${token}`,
    };
    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        return res.status(400).json({
          message: 'Error sending email',
        });
      }
      return res.status(200).json({
        message: 'Email sent',
      });
    });
  },

  resetPassword: async (req, res) => {
    const { resetToken } = req.params;
    const { password, confirmPassword } = req.body;
    const token = await Token.findOne({
      token: resetToken,
    });
    if (!token) {
      return res.status(400).json({
        message: 'Token is invalid',
      });
    }
    const user = await User.findById(token.userId);
    if (!user) {
      return res.status(400).json({
        message: 'User not found',
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: 'Passwords do not match',
      });
    }
    const hash = await bcrypt.hash(password, 10);
    user.password = hash;
    await user.save();
    return res.status(200).json({
      message: 'Password changed',
    });
  },

  editUser: async (req, res) => {
    const { name, email, password } = req.body;
    const user = await User.findById(req.user.id);
    user.name = name;
    user.email = email;
    user.password = bcrypt.hashSync(password, 10);
    await user.save();
    return res.status(201).json({
      user
    })
  },

  deleteUser: async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId);
    await user.remove();
    return res.send(user);
  },

  postsByUser: async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId).populate('posts');

    return res.json(user.posts);

  },

  logout: async (req, res) => {
    return res.send ({
      error: true,
      message: 'User successfully logged out',
      token: '',
      data: null
    });
  },

  getUsers: async (req, res) => {
    const users = await User.find({ _id: { $ne: req.user.id } });
    return res.send({
      error: false,
      message: 'Users',
      data: users,
    });
  },


  profile: async (req, res) => {
    const { id } = req.user;
    const user = await User.findById(id).populate('posts');

    console.log("works");

    return res.json(user);
  },

  getUserById: async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId);

    return res.json(user);
  },

  getAverageRating: async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId).populate('ratings');

    var sum = 0;
    for (var i = 0; i < user.ratings.length; i++) {
      sum += user.ratings[i].stars;
    }

    var avg = sum / user.ratings.length;

    return res.json(avg);
  },

  likePost: async (req, res) => {

    const { postId } = req.params;
    const post = await Post.findById(postId).populate('likes').populate('user');
    const user = await User.findById(req.user.id);

    // if post likes contains current user
    if (post.likes.some(like => like._id.equals(user._id))) {
      // remove like
      post.likes.pull(user._id);
      post.liked = false;
      await post.save();
      return res.send({
        error: false,
        message: 'Post unliked',
        data: [post],
      });
    } else {
      // add like
      post.likes.push(user);
      post.liked = true;
      await post.save();
      return res.send({
        error: false,
        message: 'Post liked',
        data: [post],
      });
    }

  },

  rateUser: async (req, res) => {

    const { ratedUserId } = req.params;
    const { stars } = req.body;
    const ratedUser = await User.findById(ratedUserId);
    const user = await User.findById(req.user.id);

    if (ratedUser.ratings.some(rating => rating.user.equals(user._id))) {
      ratedUser.ratings.forEach(rating => {
        if (rating.user.equals(user._id)) {
          rating.stars = stars;
        }
      });
    }
    else {
      ratedUser.ratings.push({ user: user._id, stars: stars });
    }

    await ratedUser.save();

    return res.status(201).json({
      ratedUser
    });
  },

  followUser: async (req, res) => {

    const { userId } = req.params;
    const followedUser = await User.findById(userId);
    const user = await User.findById(req.user.id);

    if (followedUser.followers.includes(user._id)) {
      followedUser.followers = followedUser.followers.pull(user._id);
      user.following = user.following.pull(followedUser._id);
    }
    else {
      followedUser.followers.push(user._id);
      user.following.push(followedUser._id);
    }

    await followedUser.save();
    await user.save();

    return res.status(201).json({
      followedUser
    });
  },

  createStory: async (req, res) => {
    const { type, content } = req.body;
    const user = await User.findById(req.user.id);

    const story = await Story.create({
      type,
      content,
      user: user._id
    });

    user.stories.push(story._id);

    setInterval(async () => {
      await story.remove();

      user.stories = user.stories.filter(story => story._id !== story._id);
      await user.save();
    }, 10000);

    await user.save();

    return res.status(201).json({
      story
    });
  },

  getStories: async (req, res) => {
    const stories = await Story.find({});

    return res.status(200).json({
      stories
    });
  },

  getStory: async (req, res) => {
    const { content } = req.params;

    const story = await Story.findOne({ content });

    return res.status(200).json({
      story
    });
  },

  currentUser: async (req, res) => {
    const { id } = req.user;
    const user = await User.findById(id);

    return res.send({
      error: false,
      message: 'Posts',
      data: [user],
    });
  }
}