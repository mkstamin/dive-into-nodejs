const { body } = require('express-validator');
const validator = require('validator');

const linkValidator = (value) => {
    if (value) {
        if (!validator.isURL(value)) {
            throw new Error('Please provide valid URL');
        }
    }
    return true;
};

module.exports = [
    body('name')
        .not()
        .isEmpty()
        .withMessage('Name can  not be Empty')
        .isLength({ max: 50 })
        .withMessage('Name can not be more then 50 chars')
        .trim(),
    body('title')
        .not()
        .isEmpty()
        .withMessage('Title can  not be Empty')
        .isLength({ max: 100 })
        .withMessage('Title can not be more then 100 chars')
        .trim(),
    body('bio')
        .not()
        .isEmpty()
        .withMessage('Bio can  not be Empty')
        .isLength({ max: 100 })
        .withMessage('Bio can not be more then 500 chars'),
    body('website').custom(linkValidator),
    body('facebook').custom(linkValidator),
    body('twitter').custom(linkValidator),
    body('github').custom(linkValidator),
];
