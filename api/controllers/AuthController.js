const User = require('../models/User');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ratemeenoreply@gmail.com',
      pass: 'fszkwtsjfxhxnecx',
    },
  });

module.exports = {
    register : async (req, res) => {
        const { firstname, lastname, password, email } = req.body;
        const user = await User.findOne ({ email });
        if (user) {
            return res.status(400).send({ status : 400, message: 'This account already exists' });
        }
        
        // crypt password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({
            firstname,
            lastname,
            password: hashedPassword,
            email,
        });
        const token = jwt.sign({ id : newUser._id }, 'secret', {
            expiresIn: 86400,
        });
        const url = `http://localhost:3000/verify/${token}`;
        const mailOptions = {
            from: 'ratemeenoreply@gmail.com',
            to: email,
            subject: 'Please verify your email',
            html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
        };
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        return res.status(200).send({
            statusCode : 200,
            message : "Successfully registered",
            user : newUser,
        });
    },


    login: async (req, res) => {
        const { email, password } = req.body;
        const user = await User.findOne ({ email });
        if (!user) {
            return res.status(400).send({
                statusCode : 400, 
                message: 'This account doesnt exist',
                user : undefined 
            });
        }
        if (!await bcrypt.compare(password, user.password)) {
            return res.send ({
                statusCode : 400, message: 'Password is incorrect'
            });
          }

        if (!user.isVerified) {
            return res.status(401).send({ statusCode : 401,  message: 'User is not verified' });
        }
        
        const token = jwt.sign({ id: user._id }, 'secret', {
            expiresIn: 86400,
        });

        // save token to cookie

        return res.cookie('token', token, { httpOnly: true }).status(200).send({
            statusCode : 200,
            message : "Successfully logged in",
            token : token,
            user : user,
        });
    },
    
    // logout and clear cookie
    logout: async (req, res) => {
        res.clearCookie('token').send({
            status : 200,
            message : "Successfully logged out",
        });
    }
}


