'use strict';

const express = require('express');
const router = express.Router();
const Auth = require('../controllers/AuthController.js');

// User routes

router.post('/register', Auth.register);
router.post('/login', Auth.login);
router.get('/logout', Auth.logout);
router.post('/sendEmail', Auth.sendEmail);
router.post('/verifyEmail/:verificationToken', Auth.verifyEmail);
router.post('/forgotpassword', Auth.forgotPassword);
router.post('/verifyResetPasswordCode/:resetToken', Auth.verifyResetPasswordCode);
router.put('/resetPassword/:resetToken', Auth.resetPassword);
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


router.get('/uploads/:filename', Post.showImage);

// post routes

router.post('/post/create', User.loginRequired, Post.createPost);

router.get('/post/:postId/likes', Post.getPostLikes);

router.post('/post/delete/:postId', User.loginRequired, Post.deletePost);

router.post('/post/:commentId/like', User.loginRequired, Comment.likeComment);

router.get('/posts', User.loginRequired, Post.getPosts);

router.get('/currentuserposts', Post.getCurrentUserPosts);

router.post('/:postId/comment', User.loginRequired, Comment.createComment);

router.post('/post/:postId/comment/delete/:commentId', User.loginRequired, Comment.deleteComment);

router.post('/post/comment/:commentId/reply', User.loginRequired, Comment.replyComment);

router.get('/post/:postId', Post.getPostById);

router.get('/:postId/comments', User.loginRequired, Post.getPostComments);

// delete all user posts
router.post('/post/deleteAllUserPosts/:userId', User.loginRequired, Post.deleteAllUserPosts);
*/

module.exports = router;


