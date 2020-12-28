const Post = require('../../models/Post');
const Comment = require('../../models/Comment');

exports.commentPostController = async (req, res, next) => {
    const { postId } = req.params;
    const { body } = req.body;

    if (!req.user) {
        return res.status(403).json({
            error: 'You are not an authenticated user',
        });
    }

    const comment = new Comment({
        post: postId,
        user: req.user._id,
        body,
        replies: [],
    });

    try {
        const createdComment = await comment.save();

        await Post.findByIdAndUpdate({ _id: postId }, { $push: { comments: createdComment._id } });

        const commentJSON = await (await Comment.findById(createdComment._id)).populate({
            path: 'user',
            select: 'profilePics username',
        });

        return res.status(201).json(commentJSON);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            error: 'Server Error Occurred',
        });
    }
};
exports.replyCommentController = async (req, res, next) => {
    const { commentId } = req.params;
    const { body } = req.body;

    if (!req.user) {
        return res.status(403).json({
            error: 'You are not an authenticated user',
        });
    }

    const reply = {
        body,
        user: req.user._id,
    };

    try {
        await Comment.findOneAndUpdate({ _id: commentId }, { $push: { replies: reply } });

        res.status(201).json({
            ...reply,
            profilePics: req.user.profilePics,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            error: 'Server Error Occurred',
        });
    }
};
