const Profile = require('../../models/Profile');

exports.bookmarksController = async (req, res, next) => {
    const { postId } = req.params;

    if (!req.user) {
        return res.status(403).json({
            error: 'You are not an authenticated user',
        });
    }

    const userId = req.user._id;
    let bookmark = null;

    try {
        const profile = await Profile.findOne({ user: userId });

        if (profile.bookmarks.includes(postId)) {
            await Profile.findOneAndUpdate({ user: userId }, { $pull: { bookmarks: postId } });
            bookmark = false;
        } else {
            await Profile.findOneAndUpdate({ user: userId }, { $push: { bookmarks: postId } });
            bookmark = true;
        }
        res.status(200).json({
            bookmark,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            error: 'Server Error Occurred',
        });
    }
};
