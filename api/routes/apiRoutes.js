const router = require('express').Router();
const { isAuthenticated } = require('../../middleware/authMiddleware');

const {
    commentPostController,
    replyCommentController,
} = require('../controllers/commentController');

const {
    likesGetController,
    disLikesGetController,
} = require('../controllers/likeDislikeController');
const { bookmarksController } = require('../controllers/bookmarkController');

router.post('/comments/:postId', isAuthenticated, commentPostController);
router.post('/comments/replies/:commentId', isAuthenticated, replyCommentController);

router.get('/likes/:postId', isAuthenticated, likesGetController);
router.get('/dislikes/:postId', isAuthenticated, disLikesGetController);

router.get('/bookmarks/:postId', isAuthenticated, bookmarksController);

module.exports = router;
