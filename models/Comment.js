const { Schema, model } = require('mongoose');

// const User=require('./User')
// const Post=require('./Post')

const commentScheme = new Schema(
    {
        post: {
            type: Schema.Types.ObjectId,
            ref: 'Post',
            required: true,
        },
        uesr: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        body: {
            type: Schema.Types.ObjectId,
            trim: true,
            required: true,
        },
        replies: [
            {
                body: {
                    type: String,
                    required: true,
                },
                uesr: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
                createAt: {
                    type: Date,
                    default: new Date(),
                },
            },
        ],
    },
    // eslint-disable-next-line comma-dangle
    { timestamps: true }
);

const Comment = model('Comment', commentScheme);
module.exports = Comment;
