'use Strict';

const Comment = require('../models/comment.js');
const Post = require('../models/post.js');
const User = require('../models/user.js');

module.exports = {
    createComment : async (req, res) => {
        const { content } = req.body;
        const { postId } = req.params;
        const user = await User.findById(req.user.id);
        const post = await Post.findById(postId);
        const comment = await Comment.create({
            content,
            user: user._id,
            post: post._id
        });

        post.comments.push(comment._id);
        await user.save();
        await post.save();

        return res.status(201).json({
            comment
        });
    },

    deleteComment : async (req, res) => {
        const { commentId } = req.params;
        const comment = await Comment.findById(commentId);

        await comment.remove();
        return res.send(comment);
    },

    getComments : async (req, res) => {
        const { postId } = req.params;
        const post = await Post.findById(postId).populate('comments');
        return res.json(post.comments);
    },

    likeComment : async (req, res) => {
        const { commentId } = req.params;
        const comment = await Comment.findById(commentId);
        const user = await User.findById(req.user.id);

        if (comment.likes.includes(user._id)) {
            comment.likes = comment.likes.pull(user._id);
        }
        else {
            comment.likes.push(user._id);
        }

        await comment.save();

        return res.status(201).json({
            comment
        });
    },

    replyComment : async (req, res) => {
        const { content } = req.body;
        const { commentId } = req.params;
        const user = await User.findById(req.user.id);
        const comment = await Comment.findById(commentId);
        const reply = await Comment.create({
            content,
            user: user._id,
            post: comment.post,
            parent: comment._id
        });

        comment.replies.push(reply._id);
        await user.save();
        await comment.save();

        return res.status(201).json({
            reply
        });
    },
    
}