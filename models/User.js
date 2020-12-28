const { Schema, model } = require('mongoose');

// const Profile = require('./Profile');

const userSchema = new Schema(
    {
        username: {
            type: String,
            trim: true,
            maxlength: 15,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        profile: {
            type: Schema.Types.ObjectId,
            ref: 'Profile',
        },
        profilePics: {
            type: String,
            default: '/uploads/dp.png',
        },
    },
    // eslint-disable-next-line prettier/prettier
    { timestamps: true },
);
const User = model('User', userSchema);
module.exports = User;