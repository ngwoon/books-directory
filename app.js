var createError = require('http-errors');
var express = require('express');
var path = require('path');
// var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mysql = require("mysql2");
const os = require("os");
const session = require("express-session");
const FileStore = require('session-file-store')(session);
const secret = require("./secrets.json");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var docRouter = require('./routes/document');

// var bodyParser = require('body-parser');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// session setting
app.use(session({  // 2
    secret: 'keyboard cat',  // 암호화
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/document', docRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.render("404");
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
