require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
// const config = require('config');

// Import routers
const authRoutes = require('./routes/authRoute');
const dashboardRoutes = require('./routes/dashboardRoute');

// Impor Middleware
const { bindUserWithRequest } = require('./middleware/authMiddleware');
const setLocals = require('./middleware/setLocals');

// playground routes
// const validatorRoute = require('./playground/validator');

const { DB_ADMIN } = process.env;
const { DB_PASSWORD } = process.env;

const store = new MongoDBStore({
    uri: `mongodb+srv://${DB_ADMIN}:${DB_PASSWORD}@nodejs.p2cpc.mongodb.net/exp_blog?retryWrites=true&w=majority`,
    collection: 'sessions',
    expires: 60 * 60 * 2 * 1000,
});

const app = express();

// config related work here

// console.log(process.env.NODE_ENV);
// console.log(app.get('env'));
// console.log(config.get('name'));

// const config = require('./config/config');
// if (app.get('env').toLowerCase() === 'development') {
//     console.log(config.dev.name);
// } else {
//     console.log(config.prod.name);
// }

if (app.get('env').toLowerCase() === 'development') {
    app.use(morgan('dev'));
}

// setup view wngine
app.set('view engine', 'ejs');
app.set('views', 'views');

// Middleware array
const middleware = [
    express.static('public'),
    express.urlencoded({ extended: true }),
    express.json(),
    session({
        secret: process.env.SECRET_KEY || 'SECRET_KEY',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 60 * 60 * 2 * 1000,
        },
        store,
    }),
    bindUserWithRequest(),
    setLocals(),
    flash(),
];

app.use(middleware);

app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);

// app.use('/playground', validatorRoute);

app.get('/', (req, res) => {
    res.json({
        message: 'Hello world',
    });
});

const PORT = process.env.PORT || 3000;

mongoose
    .connect(
        `mongodb+srv://${DB_ADMIN}:${DB_PASSWORD}@nodejs.p2cpc.mongodb.net/exp_blog?retryWrites=true&w=majority`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
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
