
import { User } from "../models/user.js";
import { Post } from "../models/post.js";

export default {
    createPost: async (req, res) => {
        try {
          const { content } = req.body;
          const user = await User.findById(req.user.id);
          
          const post = await Post.create({
            content,
            user: user,
            image: `${req.protocol}://${req.get("host")}${process.env.IMGURL}/${req.file.filename}`,
          });
          console.log(req.file.filename);
          console.log(req.file)
      
          // push post to user
          await post.save();
      
          return res.status(200).json({
            statusCode: 200,
            message: 'Post created',
            post: post,
          });
        } catch (error) {
          console.error(error);
          return res.status(500).json({
            statusCode: 500,
            message: 'Internal server error',
          });
        }
    },      

    fetchPosts: async (req, res) => {
        const { page } = req.params;
        const posts = await Post.find().populate('user').populate({ path: 'comments', populate: { path: 'user', model: 'User', }, }).sort({ createdAt: -1 }).skip((page - 1) * 10).limit(10);

        return res.status(200).json({
            statusCode: 200,
            message: 'Posts fetched',
            posts: posts,
        });
    },

    fetchCurrentUserPosts: async (req, res) => {
        const { page } = req.params;
        const posts = await Post.find({ user: req.user.id }).populate('user').populate({ path: 'comments', populate: { path: 'user', model: 'User', }, }).sort({ createdAt: -1 }).skip((page - 1) * 10).limit(10);

        return res.status(200).json({
            statusCode: 200,
            message: 'Profile posts fetched',
            posts: posts,
        });
    },

    likePost: async (req, res) => {
        const { postId } = req.params;
        const post = await Post.findById(postId).populate('user').populate({ path: 'comments', populate: { path: 'user', model: 'User', }, });
        const user = await User.findById(req.user.id);

        if (post.likes.some(like => like._id.equals(user._id))) {
            post.likes.pull(user._id);
            await post.save();
            return res.status(200).send({
                statusCode: 200,
                message: 'Post unliked',
                data: post,
            });
        } else {
            // add like
            post.likes.push(user._id);
            await post.save();
            return res.status(200).send({
                statusCode: 200,
                message: 'Post liked',
                data: post,
            });
        }
    },

    fetchPostLikes: async (req, res) => {
        const { postId } = req.params;
        const post = await Post.findById(postId).populate('user').populate({ path: 'comments', populate: { path: 'user', model: 'User', }, });

        return res.status(200).send({
            statusCode: 200,
            message: 'Post likes fetched',
            post: post,
        });
    },

    fetchPostComments: async (req, res) => {
        const { postId } = req.params;
        const post = await Post.findById (postId).populate('user').populate({ path: 'comments', populate: { path: 'user', model: 'User', }, });

        return res.status(200).send({
            statusCode: 200,
            message: 'Post comments fetched',
            post: post,
        });
    },

    // get posts by user id
    fetchUserPosts: async (req, res) => {

        const { userId } = req.params;
        const user = await User.findById (userId);
        const posts = await Post.find({ user: userId });

        return res.status(200).send({
            statusCode: 200,
            message: 'User posts fetched',
            posts: posts,
        });
    },

    /*// show image
    showImage: async (req, res) => {
        const { filename } = req.params;
        return
        res.status(200).sendFile(path.join(__dirname, `../uploads/${filename}`));
    },

    deletePost: async (req, res) => {
        const { postId } = req.params;
        const post = await Post.findById(postId);

        await post.remove();
        return res.send(post);
    },

    // delete all user posts and pull from user
    deleteAllUserPosts: async (req, res) => {
        const { userId } = req.params;
        const user = await User.findById (userId);
        const posts = await Post.find({ user: userId });

        await Post.deleteMany({ user: userId });
        // pull post id from user
        user.posts = user.posts.pull(posts._id);
        await user.save();

        return res.send({
            error: false,
            message: 'All user posts deleted',
            data: [],
            post: null,
        });
    },

    getPostById: async (req, res) => {
        const { postId } = req.params;
        const post = await Post.findById(postId).populate('user').populate('likes').populate({
            path: 'comments',
            populate: {
                path: 'user',
                model: 'User',
            }
        }).sort({ createdAt: -1 });

        return res.send({
            error: false,
            message: 'Post',
            data: [],
            post: post,

        });
    },

    getCurrentUserPosts: async (req, res) => {
        const posts = await Post.find({ user: req.user.id }).populate('user').populate('likes').sort({ createdAt: -1 });

        return res.send({
            error: false,
            message: 'Current user posts',
            data: posts,
            post: null,
        })
    },

    // get post comments by post id and populate comment users and sort from newest to oldest
    getPostComments: async (req, res) => {
        const { postId } = req.params;
        // order ascending by comment data
        const post = await Post.findById(postId).populate('user').populate('likes').populate({
            path: 'comments',
            populate: {
                path: 'user',
                model: 'User',
            },
        })
        
        const comments = await Comment.find({ post }).populate('user').sort({ createdAt: -1 });

        return res.send({
            error: false,
            message: 'Post comments',
            data: comments,
            post: post,
        });
    },

    getAllPosts: async (req, res) => {
        const posts = await Post.find().populate('user').populate('comments').sort({ createdAt: -1 });
        return res.send({
            error: false,
            message: 'Posts',
            data: posts,
            post: null,
        });
    },

    // get each post likes
    getPostLikes: async (req, res) => {
        const { postId } = req.params;
        const post = await Post.findById(postId).populate('likes');
        return res.send({
            error: false,
            message: 'Users',
            data: post.likes,
            token: ''
        });
    },*/

}
