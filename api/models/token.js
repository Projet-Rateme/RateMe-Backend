'use strict';

const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    email : {
        type: String,
        required: true
    },
    code : {
        type: String,
    },
    token: {
        type: String,
        required: true
    },
    expires: {
        type: Date,
        expires: 604800
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Token', tokenSchema);
