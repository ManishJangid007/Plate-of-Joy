if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));

// Routes
const indexRoute = require('./routes/index');
app.use('/', indexRoute);

app.listen(port, () => console.log('listening on port ' + port));