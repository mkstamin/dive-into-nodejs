const { Schema, model } = require('mongoose');

// const User = require('./User');
// const Post = require('./Post');

const profileScema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 50,
        },
        title: {
            type: String,
            trim: true,
            required: true,
            maxlength: 100,
        },
        bio: {
            type: String,
            trim: true,
            required: true,
            maxlength: 500,
        },
        profilePic: String,
        links: {
            website: String,
            facebook: String,
            twitter: String,
            github: String,
        },
        posts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Post',
            },
        ],
        bookmarks: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Post',
            },
        ],
    },
    // eslint-disable-next-line comma-dangle
    { timestamps: true }
);

const Profile = model('Profile', profileScema);
module.exports = Profile;
