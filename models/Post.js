const { Schema, model } = require('mongoose');

// const User = require('./User');
// const Comment = require('./Comment');

const postSchema = new Schema(
    {
        title: {
            type: String,
            trim: true,
            maxlength: 100,
            required: true,
        },
        body: {
            type: String,
            required: true,
            maxlength: 5000,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        tags: {
            type: [String],
            required: true,
        },
        thumbnail: String,
        readTime: String,
        likes: [Schema.Types.ObjectId],
        dislikes: [Schema.Types.ObjectId],
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Comment',
            },
        ],
    },
    // eslint-disable-next-line comma-dangle
    { timestamps: true }
);

const Post = model('Post', postSchema);
module.exports = Post;
