const User = require('../models/User');
const Token = require('../models/Token');
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
        const { firstname, lastname, password, confirmPassword, email } = req.body;
        const user = await User.findOne ({ email });

        if (password !== confirmPassword) {
            return res.status(400).send({
                statusCode : 400,
                message : "Passwords do not match",
            });
        }
        
        // crypt password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({
            firstname,
            lastname,
            password: hashedPassword,
            email,
            isVerified : true
        });
        return res.status(200).send({
            statusCode : 200,
            message : "Successfully registered",
            user : newUser,
        });
    },

    sendEmail : async (req, res) => {
        const { email } = req.body;
        // if email already exists 
        const user = await User.findOne ({ email });
        const validEmail = (email) => {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
          };
        
        if (!validEmail(email)) {
            return res.status(400).send({ statusCode : 400, message: 'Invalid email' });
        }
        if (user) {
            return res.status(400).send({ statusCode : 400, message: 'This account already exists' });
        }
        const code = Math.floor(100000 + Math.random() * 900000);
        const newToken = await Token.create({
            email,
            code,
            token: jwt.sign({ email }, 'secret', { expiresIn: '1h' }),
        });
        const mailOptions = {
            from: '"Rate me" <ratemeenoreply@gmail.com>',
            to: email,
            subject: 'Rate me - Email verification',
            html: `<h1>Welcome to Daizy</h1>
            <p>Thank you for registering on Rate me</p>
            <p>Please verify your email by entering the following code: ${code}</p>`,
        };
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                return res.status(500).send({ statusCode : 500, message: 'Error sending email' });
            }
            return res.status(200).send({
                statusCode : 200,
                message : "Email sent",
                token : newToken.token,
            });
        });
    },

    // just verify if the code is correct before creating the user
    verifyEmail : async (req, res) => {
        const { code } = req.body;
        const { verificationToken } = req.params;
        const token = await Token.findOne ({ token: verificationToken });
        if (!token) {
            return res.status(400).send({ statusCode : 400, message: 'Invalid token' });
        }
        if (token.code !== code) {
            return res.status(400).send({ statusCode : 400, message: 'Invalid code' });
        }
        return res.status(200).send({
            statusCode : 200,
            message : "Email verified",
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

    forgotPassword: async (req, res) => {
        const { email } = req.body;
        const user = await User.findOne ({ email });
        if (!user) {
            return res.status(400).send({ statusCode : 400, message: 'This account doesnt exist' });
        }
        const code = Math.floor(100000 + Math.random() * 900000);
        const newToken = await Token.create({ email, code, token: jwt.sign({ email }, 'secret', { expiresIn: '1h' }) });
        const mailOptions = {
            from: '"Daizy team" <ratemeenoreply@gmail.com>',
            to: email,
            subject: 'Daizy - Reset password',
            html: `<h1>Welcome to Daizy</h1>
            <p>Please enter the following code to reset your password: ${code}</p>`,
        };
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                return res.status(500).send({ statusCode : 500, message: 'Error sending email' });
            }
            return res.status(200).send({
                statusCode : 200,
                message : "Email sent",
                token : newToken.token,
            });
        });
    },

    verifyResetPasswordCode: async (req, res) => {
        const { code } = req.body;
        const { resetToken } = req.params;
        const token = await Token.findOne ({ token: resetToken });
        if (!token) {
            return res.status(400).send({ statusCode : 400, message: 'Invalid token' });
        }
        if (token.code !== code) {
            return res.status(400).send({ statusCode : 400, message: 'Invalid code' });
        }
        return res.status(200).send({
            statusCode : 200,
            message : "Code verified",
            token : token.token,
        });
    },

    resetPassword: async (req, res) => {
        const { password, confirmPassword } = req.body;
        const { resetToken } = req.params;
        const token = await Token.findOne ({ token: resetToken });
        if (!token) {
            return res.status(400).send({ statusCode : 400, message: 'Invalid token' });
        }
        if (password !== confirmPassword) {
            return res.status(400).send({ statusCode : 400, message: 'Passwords do not match' });
        }
        const user = await User.findOne ({ email: token.email });
        if (!user) {
            return res.status(400).send({ statusCode : 400, message: 'This account doesnt exist' });
        }
        user.password = await bcrypt.hash(password, 10);
        await user.save();
        return res.status(200).send({
            statusCode : 200,
            message : "Password changed",
        });
    },


    
    // logout and clear cookie
    logout: async (req, res) => {
        res.clearCookie('token').send({
            statusCode : 200,
            message : "Successfully logged out",
        });
    }
}


