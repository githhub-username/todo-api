const express = require('express');
const router = express.Router();
const user = require('../models/User');
const bcryptjs = require('bcryptjs');
const User = require('../models/User');
const user_jwt = require('../middleware/user_jwt');
const { token } = require('morgan');
const jwt = require('jsonwebtoken');

router.get('/', user_jwt, async (req, resp, next) => {
    try {

        const user = await User.findById(req.user.id).select('-password');
        resp.status(200).json({
            success: true,
            user: user
        });

    } catch(err) {
        resp.status(500).json({
            success: false,
            msg: 'Server Error'
        });
        next();
    }
    }
)

router.post('/register', async (req, resp, next) => {
    const {username, email, password} = req.body;

    try {
        
        let userExist = await User.findOne({email: email});
        
        if(userExist) {
            resp.json({
                success: false,
                msg: 'User already exists'
            });
        }

        let user = new User();

        user.username = username;
        user.email = email;
        
        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(password, salt);

        let size = 200;
        user.avatar = "https://gravatar.com/avatar/?s="+size+"&d=retro";

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, process.env.jwtUserSecret, {
            expiresIn: 360000
        }, (err, token) => {
            if(err) throw err;
            resp.status(200).json({
                success: true,
                token: token
            });
        });

    } catch (err) {
        console.log(err);
    }
});

router.post('/login', async (req, resp, next) => {
    const {email, password} = req.body;

    try {
        
        let user = await User.findOne({email: email});

        if(!user) {
            resp.status(400).json({
                success: false,
                msg: 'User not exist. Register to continue'
            })
        }
        
        const isMatch = await bcryptjs.compare(password, user.password);

        if(!isMatch) {
            return resp.status(400).json({
                success: false, 
                msg: 'Invalid Password'
            });
        }

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload, process.env.jwtUserSecret, {
                expiresIn: 360000
            }, (err, token) => {
                if(err) throw err;

                resp.status(200).json({
                    success: true,
                    token: token,
                    msg: 'User Logged In',
                    user: user
                });
            }
        )

    } catch (err) {
        resp.status(500).json({
            success: false,
            msg: 'Server Error'
        })
    }
})

module.exports = router;