const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const Flash = require('../utils/Flash');

const User = require('../models/User');
const errorformatter = require('../utils/validatorErrorFormator');

exports.signupGetController = (req, res) => {
    res.render('pages/auth/signup', {
        title: 'Creat a new accoumt',
        error: {},
        value: {},
        flashMessage: Flash.getMessage(req),
    });
};

// eslint-disable-next-line consistent-return
exports.signupPostController = async (req, res, next) => {
    const { username, email, password } = req.body;

    const errors = validationResult(req).formatWith(errorformatter);

    if (!errors.isEmpty()) {
        req.flash('fail', 'Please check your Form');
        return res.render('pages/auth/signup', {
            title: 'Creat a new accoumt',
            error: errors.mapped(),
            value: {
                username,
                email,
                password,
            },
            flashMessage: Flash.getMessage(req),
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 11);

        const user = new User({
            username,
            email,
            password: hashedPassword,
        });

        await user.save();
        req.flash('success', 'User created successfully');
        res.redirect('/auth/login');
        // console.log('User created succesfully', createdUser);
        // res.render('pages/auth/login', {
        //     title: 'Creat a new accoumt',
        //     error: {},
        //     value: {},
        //     flashMessage: Flash.getMessage(req),
        // });
    } catch (e) {
        next(e);
    }
};

exports.loginGetController = (req, res) => {
    // console.log(req.session);
    // console.log(req.session.isLoggedIn, req.session.user);
    res.render('pages/auth/login', {
        title: 'login with your account',
        error: {},
        flashMessage: Flash.getMessage(req),
    });
};
// eslint-disable-next-line consistent-return
exports.loginPostController = async (req, res, next) => {
    const { email, password } = req.body;

    const errors = validationResult(req).formatWith(errorformatter);

    if (!errors.isEmpty()) {
        req.flash('fail', 'Please check your Form');
        return res.render('pages/auth/login', {
            title: 'Login to your account',
            error: errors.mapped(),
            flashMessage: Flash.getMessage(req),
        });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            req.flash('fail', 'Did not match you Info');
            return res.render('pages/auth/login', {
                title: 'Login to your account',
                error: {},
                flashMessage: Flash.getMessage(req),
            });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            req.flash('fail', 'Did not match you Info');
            return res.render('pages/auth/login', {
                title: 'Login to your account',
                error: {},
                flashMessage: Flash.getMessage(req),
            });
        }
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save((err) => {
            if (err) {
                next(err);
            } else {
                req.flash('success', 'Successfully logedin');
                res.redirect('/dashboard');
            }
        });
        // console.log(user, 'Successfull');
    } catch (e) {
        next(e);
    }
};
exports.logoutController = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            next(err);
        } else {
            // req.flash('success', 'Logout successfull');
            res.redirect('/auth/login');
        }
    });
};
