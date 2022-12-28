'use strict';

const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,ref:'User',
        required: true
    },
    code : {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    expires: {
        type: Date,
        default: Date.now,
        index: { expires: '1h' }
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Token', tokenSchema);
