const dotenv = require('dotenv');
dotenv.config();
// create server
const express = require('express');
const app = express();
// cros origin
const cors = require('cors')
app.use(cors())
// connect database
require('./src/models/__index');
// dependencies
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const createError = require('http-errors');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// routes
const userRoute = require('./src/routes/users');
const sessionRoute = require('./src/routes/sessions');
const accountRoute = require('./src/routes/accounts');
const orderRoute = require('./src/routes/orders');
const productRoute = require('./src/routes/products');
app.use('/api/v1', 
userRoute, 
sessionRoute, 
accountRoute, 
orderRoute, 
productRoute
);

const keyRoute = require('./src/routes/apiKey');
app.use('/api/admin', keyRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
