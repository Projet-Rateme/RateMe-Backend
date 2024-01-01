import express from "express";
import authController from "../controllers/AuthController.js";
import postsController from "../controllers/postsController.js";
import commentsController from "../controllers/commentsController.js";
import { singleImage } from "../middlewares/multer-config.js";
const router = express.Router();

// User routes

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/sendEmail', authController.sendEmail);
router.post('/verifyEmail/:verificationToken', authController.verifyEmail);
router.post('/forgotpassword', authController.forgotPassword);
router.post('/verifyResetPasswordCode/:resetToken', authController.verifyResetPasswordCode);
router.put('/resetPassword/:resetToken', authController.resetPassword);
router.get('/current', authController.getCurrentUser);
router.get('/getUsers', authController.getAllUsers);
router.post('/updateProfile', singleImage, authController.getCurrentUser, authController.updateProfile);
// fetch user posts
router.get('/user/:userId/posts', postsController.fetchUserPosts);

router.get('/posts',authController.getCurrentUser, postsController.fetchPosts);
router.post('/post/create', singleImage ,authController.getCurrentUser, postsController.createPost);
router.get('/myprofileposts',authController.getCurrentUser, postsController.fetchCurrentUserPosts);
router.post('/post/:postId/like', authController.getCurrentUser, postsController.likePost);
router.post('/post/:postId/comment', authController.getCurrentUser, commentsController.createComment);
router.get('/post/:postId/comments', authController.getCurrentUser, postsController.fetchPostComments);
router.get('/post/:postId/likes', authController.getCurrentUser, postsController.fetchPostLikes);
router.delete('/post/:postId/deletecomments', authController.getCurrentUser, commentsController.deletePostComments);
/*router.get('/profile', User.profile);
router.put('/editUser', User.loginRequired, User.editUser);
router.delete('/deleteUser', User.loginRequired, User.deleteUser);
router.get('/verify/:tokens', User.verify);
router.post('/forgotpassword', User.forgotPassword);
router.put('/resetpassword/:resetToken', User.resetPassword);
// post verify code with resettoken
router.post('/verifycode/:resetToken', User.verifyCode);
router.post('/upload', User.uploadImage);


router.get('/current', User.currentUser);
router.get('/getUsers', User.getUsers);
router.get('/user/:userId', User.loginRequired, User.getUserById);


router.get('/:userId/posts', User.postsByUser);
router.post('/:postId/like', User.likePost);

router.post('/:ratedUserId/rate', User.loginRequired, User.rateUser);
router.post('/:userId/follow', User.loginRequired, User.followUser);
router.get('/:userId/rating', User.getAverageRating);

router.post('/createStory', User.loginRequired, User.createStory);
router.get('/getStories', User.getStories);
router.get('/getStory/:content', User.getStory);


router.get('/uploads/:filename', postsController.showImage);

// post routes

router.post('/post/create', User.loginRequired, postsController.createPost);

router.get('/post/:postId/likes', postsController.getPostLikes);

router.post('/post/delete/:postId', User.loginRequired, postsController.deletePost);

router.post('/post/:commentId/like', User.loginRequired, commentsController.likeComment);

router.get('/posts', User.loginRequired, postsController.getPosts);

router.get('/currentuserposts', postsController.getCurrentUserPosts);

router.post('/:postId/comment', User.loginRequired, commentsController.createComment);

router.post('/post/:postId/comment/delete/:commentId', User.loginRequired, commentsController.deleteComment);

router.post('/post/comment/:commentId/reply', User.loginRequired, commentsController.replyComment);

router.get('/post/:postId', postsController.getPostById);

router.get('/:postId/comments', User.loginRequired, postsController.getPostComments);

// delete all user posts
router.post('/post/deleteAllUserPosts/:userId', User.loginRequired, postsController.deleteAllUserPosts);
*/

export default router;


