const router = require('express').Router();
const { isAuthenticated } = require('../middleware/authMiddleware');
const profileValidator = require('../validator/dashboard/profileValidator');

const {
    dashboardGetController,
    creatProfileGetController,
    creatProfilePostController,
    editProfileGetController,
    editProfilePostController,
} = require('../controllers/dashboardController');

router.get('/', isAuthenticated, dashboardGetController);

router.get('/create-profile', isAuthenticated, creatProfileGetController);
router.post('/create-profile', isAuthenticated, profileValidator, creatProfilePostController);

router.get('/edit-profile', isAuthenticated, editProfileGetController);
router.post('/edit-profile', isAuthenticated, profileValidator, editProfilePostController);

module.exports = router;
