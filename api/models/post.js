'use strict';

const mongoose = require ('mongoose');

const PostSchema = new mongoose.Schema ({
    title: {
        type: String,
        required: 'Kindly enter the title of the post'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,ref:'User',
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,ref:'User',
        }
    ],
    liked: {
        type: Boolean,
        default: false
    },
    image: {
        type: String,
    },
    content: {
        type: String,
        required: 'Kindly enter the content of the post'
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,ref:'Comment',
        }
    ],
}, {
    timestamps: true
});


module.exports = mongoose.model('Post', PostSchema);