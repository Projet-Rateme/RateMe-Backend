'use strict';
const Post = require ('../models/post.js');
const User = require ('../models/user.js');

const multer = require("multer");
const SharpMulter  =  require("sharp-multer");
const path = require("path");

// cloudinary from serverjs
const cloudinary = require('cloudinary').v2;

const storage = SharpMulter({
    destination: (req, file, cb) => cb(null, "uploads"), // cb -> callback
    imageOptions:{
        quality: 80,
        resize: { width: 450, height: 400 },
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

module.exports = {
    // create post with image
    createPost: async (req, res) => {
        handleMultipartData(req, res, async (err) => {
            if (err) {
                return res.status(500).send({ error: err.message });
            }
            const { content, title } = req.body;
            const user = await User.findById(req.user.id);
            const post = await Post.create({
                title,
                content,
                user: user._id,
                image: req.file.filename,
            });

            // cloudinary upload
            const result = await cloudinary.uploader.upload(req.file.path);
            post.image = result.secure_url;
            await post.save();
            


            user.posts.push(post._id);
            await user.save();
            return res.status(201).json({
                post,
            });
        });
    },
    
    // show image
    showImage: async (req, res) => {
        const { filename } = req.params;
        return
        res.status(200).sendFile(path.join(__dirname, `../uploads/${filename}`));
    },

    deletePost : async (req, res) => {
        const { postId } = req.params;
        const post = await Post.findById(postId);

        await post.remove();
        return res.send(post);
    },
    
    getPostById : async (req, res) => {
        const { postId } = req.params;
        const post = await Post.findById(postId);

        return res.json(post);
    },

    getPosts : async (req, res) => {
        const posts = await Post.find({user: {$ne: req.user.id}}).populate('user').populate('likes').sort({createdAt: -1});
        return res.send({
            error: false,
            message: 'Posts',
            data: posts,
          });
    },

    getCurrentUserPosts: async(req, res) => {
        const posts = await Post.find({user: req.user.id}).populate('user').populate('likes').sort({ createdAt: -1});

        return res.send({
            error: false,
            message: 'Current user posts',
            data: posts
        })
    },

    getAllPosts: async (req, res) => {
        const posts = await Post.find().populate('user').sort({createdAt: -1});
        return res.send({
            error: false,
            message: 'Posts',
            data: posts,
          });
    },

    // get each post likes
    getPostLikes : async (req, res) => {
        const { postId } = req.params;
        const post = await Post.findById(postId).populate('likes');
        return res.send({
            error: false,
            message: 'Users',
            data: post.likes,
          });
    },

}
