module.exports = () => (req, res, next) => {
    res.locals.user = req.user;
    res.locals.isLoggedIn = req.session.isLoggedIn;

    next();
};
