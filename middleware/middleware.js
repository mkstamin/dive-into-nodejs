require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');

const { bindUserWithRequest } = require('./authMiddleware');
const setLocals = require('./setLocals');

const { DB_ADMIN } = process.env;
const { DB_PASSWORD } = process.env;

const store = new MongoDBStore({
    uri: `mongodb+srv://${DB_ADMIN}:${DB_PASSWORD}@nodejs.p2cpc.mongodb.net/exp_blog?retryWrites=true&w=majority`,
    collection: 'sessions',
    expires: 60 * 60 * 2 * 1000,
});

// use morgan in development
// const app = express();
// if (app.get('env').toLowerCase() === 'development') {
//     app.use(morgan('dev'));
// }

const middleware = [
    morgan('dev'),
    express.static('public'),
    express.urlencoded({ extended: true }),
    express.json(),
    session({
        secret: process.env.SECRET_KEY || 'SECRET_KEY',
        resave: false,
        saveUninitialized: false,
        // cookie: {
        //     maxAge: 60 * 60 * 2 * 1000,
        // },
        store,
    }),
    flash(),
    bindUserWithRequest(),
    setLocals(),
];

module.exports = (app) => {
    middleware.forEach((m) => {
        app.use(m);
    });
};
