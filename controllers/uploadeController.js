/* eslint-disable prettier/prettier */
/* eslint-disable no-underscore-dangle */
const fs = require('fs');
const User = require('../models/User');
const Profile = require('../models/Profile');

// eslint-disable-next-line no-unused-vars
exports.uploadProfilePics = async (req, res, next) => {
    if (req.file) {
        try {
            const oldProfilePics = req.user.profilePics;
            const profile = await Profile.findOne({ usser: req.user._id });
            const profilePics = `/uploads/${req.file.filename}`;
            if (profile) {
                await Profile.findOneAndUpdate({ user: req.user._id }, { $set: { profilePics } });
            }

            await User.findByIdAndUpdate({ _id: req.user._id }, { $set: { profilePics } });

            if (oldProfilePics !== '/uploads/dp.png') {
                fs.unlink(`public${oldProfilePics}`, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }

            res.status(200).json({
                profilePics,
            });
        } catch (e) {
            res.status(500).json({
                profilePics: req.user.profilePics,
            });
        }
    } else {
        res.status(500).json({
            profilePics: req.user.profilePics,
        });
    }
};

// eslint-disable-next-line no-unused-vars
exports.removeProfilePics = (req, res, next) => {
    try {
        const defaultProfile = '/uploads/dp.png';
        const currrentProfilePics = req.user.profilePics;

        fs.unlink(`public${currrentProfilePics}`, async () => {
            const profile = await Profile.findOne({ user: req.user._id });

            if (profile) {
                await Profile.findOneAndUpdate(
                    { user: req.user._id },
                    { $set: { profilePics: defaultProfile } },
                );
            }

            await User.findOneAndUpdate(
                { _id: req.user._id },
                { $set: { profilePics: defaultProfile } },
            );
        });

        res.status(200).json({
            profilePics: defaultProfile,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'Can not Remove Profile Pics',
        });
    }
};

exports.postImageUploadController = (req, res, next) => {
    if (req.file) {
        return res.status(200).json({
            imgUrl: `/uploads/${req.file.filename}`,
        });
    }
    return res.status(500).json({
        message: 'Server Error',
    });
};
