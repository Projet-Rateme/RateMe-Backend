import { Comment } from "../models/comment.js";
import { Post } from "../models/post.js";
import { User } from "../models/user.js";

export default {
    createComment: async (req, res) => {
        const { postId } = req.params;
        const { content } = req.body;
        const post = await Post.findById(postId);
        const user = await User.findById(req.user.id);
        const comment = await Comment.create({
            content,
            user,
        });
        post.comments.push(comment);
        await post.save();
        return res.status(200).json({
            statusCode: 200,
            message: 'Comment created',
            comment: comment,
        });
    },

    // delete post comments
    deletePostComments: async (req, res) => {
        const { postId } = req.params;
        const post = await Post.findById(postId);
        const comments = await Comment.find({ _id: { $in: post.comments } });
        comments.forEach(async (comment) => {
            await comment.remove();
        }
        );
        // pull comments from post
        post.comments.pull({ _id: { $in: post.comments } });
        await post.save();
        return res.status(200).json({
            statusCode: 200,
            message: 'Post comments deleted',
        });
    },

    
    
}