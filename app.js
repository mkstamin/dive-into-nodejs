require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

// Import middleware
const setMiddleware = require('./middleware/middleware');

// Import routers
const setRoutes = require('./routes/routes');

// DB connection useing .env
const { DB_ADMIN } = process.env;
const { DB_PASSWORD } = process.env;

// app from express
const app = express();

// setup view wngine
app.set('view engine', 'ejs');
app.set('views', 'views');

// useing Middleware from routr directory
setMiddleware(app);

// useing Routes from routr directory
setRoutes(app);

app.use((req, res, next) => {
    const error = new Error('404 Page Not Found');
    error.status = 404;
    next(error);
});

// eslint-disable-next-line consistent-return
app.use((error, req, res, next) => {
    if (error.status === 404) {
        return res.render('pages/error/404', {
            title: '404 page not found',
            error: {},
            flashMessage: {},
        });
    }

    console.log(error);
    res.render('pages/error/500', {
        title: 'Internal Server Error',
        error: {},
        flashMessage: {},
    });
    next();
});

const { PORT } = process.env;
mongoose
    .connect(
        `mongodb+srv://${DB_ADMIN}:${DB_PASSWORD}@nodejs.p2cpc.mongodb.net/exp_blog?retryWrites=true&w=majority`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            // eslint-disable-next-line prettier/prettier
        },
    )
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on ${PORT}`);
        });
    })
    .catch((e) => {
        console.log(e.message);
    });
