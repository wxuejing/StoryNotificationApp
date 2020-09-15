var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var fs = require('fs');

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var signupRouter = require('./routes/signup');
var deregisterRouter = require('./routes/deregister');

var publisherRouter = require('./routes/publisher');
var readerRouter = require('./routes/reader');
var subRouter = require('./routes/subscriber');
var verifyRouter = require('./routes/verify');
var errorRouter = require('./routes/error');
var busboy = require('connect-busboy'); 

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(busboy());
app.use(express.static(path.join(__dirname, 'public')));

var temp_dir = path.join(path.join(__dirname, 'public', 'tmp'));
console.log(temp_dir);

if (!fs.existsSync(temp_dir))
    fs.mkdirSync(temp_dir);

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/verify', verifyRouter);
app.use('/deregister', deregisterRouter);
app.use('/publisher', publisherRouter);

app.use('/subscriber', subRouter);
app.use('/reader', readerRouter);
app.use('/error', errorRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = err;

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;