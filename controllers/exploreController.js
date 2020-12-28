const moment = require('moment');
const Post = require('../models/Post');
const Flash = require('../utils/Flash');

function genDate(days) {
    const date = moment().subtract(days, 'days');
    return date.toDate();
}

function generateFilterObject(filter) {
    let filterObj = {};
    let order = 1;

    switch (filter) {
        case 'week': {
            filterObj = {
                createdAt: {
                    $gt: genDate(7),
                },
            };
            order = -1;
            break;
        }
        case 'month': {
            filterObj = {
                createdAt: {
                    $gt: genDate(30),
                },
            };
            order = 1;
            break;
        }
        case 'all': {
            order = -1;
            break;
        }
        default:
            break;
    }
    return {
        filterObj,
        order,
    };
}

exports.explorerGetController = async (req, res, next) => {
    const filter = req.query.filter || 'latest';

    const { order, filterObj } = generateFilterObject(filter.toLowerCase());

    try {
        const posts = await Post.find(filterObj)
            .populate('author', 'username')
            .sort(order === 1 ? '-createdAt' : 'createdAt');
        res.render('pages/explorer/explorer', {
            title: 'Explore All Posts',
            filter,
            flashMessage: Flash.getMessage(req),
            posts,
        });
    } catch (e) {
        next(e);
    }
};
