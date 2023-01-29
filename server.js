'use strict';

var express = require('express'),
app = express(),
port = process.env.PORT || 3000,
session = require('express-session'),
bodyParser = require('body-parser'),
jsonwebtoken = require("jsonwebtoken");
const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: 'dfctbqlmj', 
    api_key: '519927818185632', 
    api_secret: 'UlPbXnJVOdxo_WgdW7MbB1GvKRA' 
  });


const mongoose = require('mongoose');
const option = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

app.use(session({
    secret: 'secret', // used to sign the session ID cookie
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  }));


mongoose.connect('mongodb+srv://Chawki32g:WP8uec9S5bPLjaP@c1.2qrjkua.mongodb.net/?retryWrites=true&w=majority', option).then(function(){
    console.log("successfully connected to the database");
}, function(err) {
    console.log(err)
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    if (req.headers && req.headers.cookie && req.headers.cookie.split('=')[0] === 'token') {
        jsonwebtoken.verify(req.headers.cookie.split('=')[1], 'secret', function(err, decode) {
            if (err) req.user = undefined;
            req.user = decode;
            next();
        });
    } else {
        req.user = undefined;
        next();
    }
});

app.use(require('./api/routes/routes'));


app.use(function(req, res) {
  res.status(404).send({ url: req.originalUrl + ' not found' })
});

app.listen(port);

console.log(' RESTful API server started on: ' + port);

module.exports = app;