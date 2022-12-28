'use Strict';

const Comment = require('../models/comment.js');
const Post = require('../models/post.js');
const User = require('../models/user.js');

module.exports = {
    //create comment with content and postId as params and populate user and post
    createComment : async (req, res) => {
        const { content } = req.body;
        const { postId } = req.params;
        const user = await User.findById(req.user.id);
        const post = await Post.findById(postId).populate('user').populate('likes').populate({
            path: 'comments',
            populate: {
                path: 'user',
                model: 'User',
                },
                }).sort({ createdAt: -1 });
        const comment = await Comment.create({
            content,
            user: user,
        });

        post.comments.push(comment);
        await post.save();

        return res.send({
            error: false,
            message: 'Comment created',
            data: [comment],
            post: post,
        });
    },

    deleteComment : async (req, res) => {
        const { commentId } = req.params;
        const comment = await Comment.findById(commentId);

        await comment.remove();
        return res.send(comment);
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