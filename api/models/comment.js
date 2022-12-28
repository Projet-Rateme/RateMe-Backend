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