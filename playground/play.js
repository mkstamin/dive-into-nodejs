const router = require('express').Router();
const upload = require('../middleware/uploadMiddleware');

router.get('/play', (req, res) => {
    res.render('playground/play', {
        title: 'Playground',
        error: {},
        flashMessage: {},
    });
});

// eslint-disable-next-line no-unused-vars
router.post('/play', upload.single('my-file'), (req, res, next) => {
    console.log('hello');

    if (req.file) {
        console.log(req.file);
    }

    res.redirect('/playground/play');
});

module.exports = router;
