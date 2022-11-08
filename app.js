const dotenv = require('dotenv');
dotenv.config();
// create server
const express = require('express');
const app = express();
// connect database
require('./src/models/__index');
// dependenciecs
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// routes
const orderRoute = require('./src/routes/orders');
const userRoute = require('./src/routes/users');
const keyRoute = require('./src/routes/apiKey');
app.use('/api/v1', orderRoute, userRoute);
app.use('/api/admin', keyRoute);




module.exports = app;
