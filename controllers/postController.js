const { validationResult } = require('express-validator');
const readingTime = require('reading-time');

const Flash = require('../utils/Flash');
const errorFormatter = require('../utils/validatorErrorFormator');

const Post = require('../models/Post');
const Profile = require('../models/Profile');

exports.createPostGetController = (req, res, next) => {
    res.render('pages/dashboard/post/createPost', {
        title: 'Create A New Post',
        error: {},
        flashMessage: Flash.getMessage(req),
        value: {},
    });
};

exports.createPostPostController = async (req, res, next) => {
    let { title, body, tags } = req.body;
    const errors = validationResult(req).formatWith(errorFormatter);

    // console.log(errors.mapped());

    if (!errors.isEmpty()) {
        res.render('pages/dashboard/post/createPost', {
            title: 'Create A New Post',
            error: errors.mapped(),
            flashMessage: Flash.getMessage(req),
            value: {
                title,
                body,
                tags,
            },
        });
    }

    // return console.log('hello');

    if (tags) {
        tags = tags.split(',');
        tags = tags.map((t) => t.trim());
    }
    const readTime = readingTime(body).text;

    const post = new Post({
        title,
        body,
        tags,
        author: req.user._id,
        thumbnail: '',
        readTime,
        likes: [],
        dislikes: [],
        comments: [],
    });

    if (req.file) {
        post.thumbnail = `/uploads/${req.file.filename}`;
    }

    try {
        const createdPost = await post.save();
        await Profile.findOneAndUpdate(
            { user: req.user._id },
            { $push: { posts: createdPost._id } },
        );
        req.flash('success', 'Post Created Successfully');
        return res.redirect(`/posts/edit/${createdPost._id}`);
    } catch (e) {
        next(e);
    }
};

exports.editPostGetController = async (req, res, next) => {
    const { postId } = req.params;

    try {
        const post = await Post.findOne({ author: req.user._id, _id: postId });

        if (!post) {
            const error = new Error('404 Page Not Found');
            error.status = 404;
            throw error;
        }

        res.render('pages/dashboard/post/editPost', {
            title: 'Edit Your Post',
            error: {},
            flashMessage: Flash.getMessage(req),
            post,
        });
    } catch (e) {
        next(e);
    }
};

exports.editPostPostController = async (req, res, next) => {
    let { title, body, tags } = req.body;
    const { postId } = req.params;
    const errors = validationResult(req).formatWith(errorFormatter);

    try {
        const post = await Post.findOne({ author: req.user._id, _id: postId });

        if (!post) {
            const error = new Error('404 Page Not Found');
            error.status = 404;
            throw error;
        }

        if (!errors.isEmpty()) {
            res.render('pages/dashboard/post/createPost', {
                title: 'Create A New Post',
                error: errors.mapped(),
                flashMessage: Flash.getMessage(req),
                post,
            });
        }
        if (tags) {
            tags = tags.split(',');
            tags = tags.map((t) => t.trim());
        }

        let { thumbnail } = post;
        if (req.file) {
            thumbnail = req.file.filename;
        }
        await Post.findOneAndUpdate(
            { _id: post._id },
            {
                $set: {
                    title,
                    body,
                    tags,
                    thumbnail,
                },
            },
            { new: true }
        );

        req.flash('success', 'Post Updated Successfully');
        return res.redirect(`/posts/edit/${post._id}`);
    } catch (e) {
        next(e);
    }
};
exports.deletePostGetController = async (req, res, next) => {
    const { postId } = req.params;

    try {
        const post = await Post.findOne({ author: req.user._id, _id: postId });
        if (!post) {
            const error = new Error('404 Page Not Found');
            error.status = 404;
            throw error;
        }
        await Post.findOneAndDelete({ _id: postId });
        await Profile.findOneAndUpdate({ user: req.user._id }, { $pull: { posts: postId } });

        req.flash('success', 'Post Delete Successfully');
        return res.redirect('/posts');
    } catch (e) {
        next(e);
    }
};

exports.getAllPostController = async (req, res, next) => {
    try {
        const posts = await Post.find({ author: req.user._id });
        res.render('pages/dashboard/post/posts', {
            title: 'My Created Post',
            error: {},
            flashMessage: Flash.getMessage(req),
            posts,
        });
    } catch (e) {
        next(e);
    }
};
