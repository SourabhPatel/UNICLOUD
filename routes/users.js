const express = require('express');
var router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
var Dropbox = require('dropbox');
var http   = require('http');

const config = require('../config/database');
const User = require('../models/user');
//Register
router.post('/register', (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    User.addUser(newUser, (err, user) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to register user' });
        } else {
            res.json({ success: true, msg: 'User registered success' });
        }
    });
});

//Authenticate
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({ success: false, msg: 'User not found' });
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign({
                    data: user
                }, 'secret', { expiresIn: 60 * 60 });

                //const token =jwt.sign(user,config.secret,{
                //   expiresIn: 604800 // 1week
                //});

                res.json({
                    success: true,
                    token: 'JWT' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                });

            } // isMatch ka if over yha
            else {
                return res.json({ success: false, msg: 'Wrong password' });
            }
        });
    });
});

//Profile
router.get('/profile/:id', function(req, res) {
    var id = req.params.id;
    console.log('hereeeeee id ye hai ');
    console.log(id);
    User.findById(req.params.id, function (err, users) {
        if(err) { return handleError(res, err); }
        console.log(users.email);
        return res.json(users);
        });
    // 59eb7add15c71d0c2958c057
});


//Validate
router.get('/validate', (req, res, next) => {
    res.send('VALIDATE');
});



module.exports = router;

module.exports.router = router;










