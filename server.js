if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');

const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);

app.use(express.urlencoded({ extended: true })); 
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));

// db_connection
mongoose.connect(
    process.env.MONGO_CONNECTION_STRING,
    console.log('Connected to Mongoose')
);

// session_setup
const store = new MongoDBSession({
    uri: process.env.MONGO_CONNECTION_STRING,
    collection: 'session'
});

app.use(
    session({
        secret: 'key to sign cookies',
        resave: false,
        saveUninitialized: false,
        store: store
    })
);

// Routes
const indexRoute = require('./routes/index');
const usersRoute = require('./routes/users');
app.use('/', indexRoute);
app.use('/users', usersRoute);

app.listen(port, console.log(`listening on port ${port}`));