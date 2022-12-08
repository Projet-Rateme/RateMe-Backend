'use strict';

const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: 'Kindly enter the content of the comment'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,ref:'User',
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,ref:'Post',
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,ref:'User',
        }
    ],
    replies: [
        {
            type: mongoose.Schema.Types.ObjectId,ref:'Comment',
        }
    ],
}, {
    timestamps: true
});

module.exports = mongoose.model('Comment', commentSchema);