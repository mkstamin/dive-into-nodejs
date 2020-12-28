/* eslint-disable comma-dangle */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const { validationResult } = require('express-validator');
const Flash = require('../utils/Flash');
const Profile = require('../models/Profile');
const User = require('../models/User');
const errorFormatter = require('../utils/validatorErrorFormator');

exports.dashboardGetController = async (req, res, next) => {
    try {
        const profile = await Profile.findOne({
            // eslint-disable-next-line no-underscore-dangle
            user: req.user._id,
        });

        if (profile) {
            return res.render('pages/dashboard/dashboard', {
                title: 'My Dashboard',
                flashMessage: Flash.getMessage(req),
            });
        }

        res.redirect('/dashboard/create-profile');
    } catch (e) {
        next(e);
    }
};

// eslint-disable-next-line consistent-return
exports.creatProfileGetController = async (req, res, next) => {
    try {
        const profile = await Profile.findOne({
            // eslint-disable-next-line no-underscore-dangle
            user: req.user._id,
        });

        if (profile) {
            return res.redirect('/dashboard/edit-profile');
        }

        res.render('pages/dashboard/create-profile', {
            title: 'Create Your Profile',
            flashMessage: Flash.getMessage(req),
            error: {},
        });
    } catch (e) {
        next(e);
    }
};
exports.creatProfilePostController = async (req, res, next) => {
    const errors = validationResult(req).formatWith(errorFormatter);

    if (!errors.isEmpty()) {
        return res.render('pages/dashboard/create-profile', {
            title: 'Create Your Profile',
            flashMessage: Flash.getMessage(req),
            error: errors.mapped(),
        });
    }

    // eslint-disable-next-line object-curly-newline
    const { name, title, bio, website, facebook, twitter, github } = req.body;

    try {
        const profile = new Profile({
            user: req.user._id,
            name,
            title,
            bio,
            profilePics: req.user.profilePics,
            links: {
                website: website || '',
                facebook: facebook || '',
                twitter: twitter || '',
                github: github || '',
            },
            posts: [],
            bookmarks: [],
        });

        const createProfile = await profile.save();
        await User.findOneAndUpdate(
            { _id: req.user._id },
            { $set: { profile: createProfile._id } }
        );

        req.flash('success', 'Profile Create Successfully');
        res.redirect('/dashboard');
    } catch (e) {
        next(e);
    }

    // return res.render('pages/dashboard/create-profile', {
    //     title: 'Create Your Profile',
    //     flashMessage: Flash.getMessage(req),
    //     error: {},
    // });
};
exports.editProfileGetController = async (req, res, next) => {
    try {
        const profile = await Profile.findOne({ user: req.user._id });
        if (!profile) {
            return res.redirect('/dashboard/create-profile');
        }

        res.render('pages/dashboard/edit-profile', {
            title: 'Edit Your Profile',
            error: {},
            flashMessage: Flash.getMessage(req),
            profile,
        });
    } catch (e) {
        next(e);
    }
};

exports.editProfilePostController = async (req, res, next) => {
    const errors = validationResult(req).formatWith(errorFormatter);

    // eslint-disable-next-line object-curly-newline
    const { name, title, bio, website, facebook, twitter, github } = req.body;

    if (!errors.isEmpty()) {
        return res.render('pages/dashboard/create-profile', {
            title: 'Create Your Profile',
            flashMessage: Flash.getMessage(req),
            error: errors.mapped(),
            profile: {
                name,
                title,
                bio,
                links: {
                    website,
                    facebook,
                    twitter,
                    github,
                },
            },
        });
    }

    try {
        const profile = {
            name,
            title,
            bio,
            links: {
                website: website || '',
                facebook: facebook || '',
                twitter: twitter || '',
                github: github || '',
            },
        };
        const updatedProfile = await Profile.findOneAndUpdate(
            { user: req.user._id },
            { $set: profile },
            { new: true }
        );
        req.flash('success', 'Profile Updated Successfully');
        res.render('pages/dashboard/edit-profile', {
            title: 'Edit Your Profile',
            error: {},
            flashMessage: Flash.getMessage(req),
            profile: updatedProfile,
        });
    } catch (e) {
        next(e);
    }
};
