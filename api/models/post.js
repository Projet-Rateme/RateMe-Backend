'use strict';

const mongoose = require ('mongoose');

const PostSchema = new mongoose.Schema ({
    user: {
        type: mongoose.Schema.Types.ObjectId,ref:'User',
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,ref:'User',
        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,ref:'Comment',
        }
    ],
    image: {
        type: String,
    },
    content: {
        type: String,
        required: 'Kindly enter the content of the post'
    },
}, {
    timestamps: true
});


module.exports = mongoose.model('Post', PostSchema);