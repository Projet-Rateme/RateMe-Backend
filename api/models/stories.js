'use Strict';

const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,ref:'User',
    },
    type: {
        type: [{
            type: String,
            enum: ['image', 'video', 'reel', 'text']
        }],
    },
    content: {
        type: String,
        required: 'Kindly enter the content of the story'
    },
    createdAt: { type: Date, expires: 20, default: Date.now }
}, {
    timestamps: true
});

module.exports = mongoose.model('Story', StorySchema);