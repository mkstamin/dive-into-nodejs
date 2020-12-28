const User = require('../models/User');

// eslint-disable-next-line consistent-return
exports.bindUserWithRequest = () => async (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return next();
    }
    try {
        const user = await User.findById(req.session.user._id);
        req.user = user;
        next();
    } catch (e) {
        console.log(e);
        next(e);
    }
};

// eslint-disable-next-line consistent-return
exports.isAuthenticated = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/auth/login');
    }
    next();
};

// eslint-disable-next-line consistent-return
exports.isUnAuthenticated = (req, res, next) => {
    if (req.session.isLoggedIn) {
        return res.redirect('/dashboard');
    }
    next();
};
