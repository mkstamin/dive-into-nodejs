const { body } = require('express-validator');
const User = require('../../models/User');

module.exports = [
    body('username')
        .isLength({ min: 2, max: 15 })
        .withMessage('Username must be 2 to 15 chars')
        .custom(async (username) => {
            const user = await User.findOne({ username });
            if (user) {
                return Promise.reject('Username already used');
            }
        })
        .trim(),
    body('email')
        .isEmail()
        .withMessage('Provide a valid email')
        .custom(async (email) => {
            const user = await User.findOne({ email });
            if (user) {
                return Promise.reject('Email already used');
            }
        })
        .normalizeEmail(),
    body('password').isLength({ min: 5 }).withMessage('Password must be 5 chars'),
    body('confirmPassword')
        .isLength({ min: 5 })
        .withMessage('Password must be 5 chars')
        .custom((confirmPassword, { req }) => {
            if (confirmPassword !== req.body.password) {
                throw new Error('Passsword does not match');
            }
            return true;
        }),
];
