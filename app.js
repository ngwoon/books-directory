var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mysql = require("mysql2");
const os = require("os");
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
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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


/*
    mysql connection
*/
const connection_param = {
    host     : secret.DEVELOP_HOST,
    user     : secret.DEVELOP_ID,
    password : secret.DEVELOP_PW,
    database : secret.DB,
};
if(os.hostname() !== secret.HOSTNAME) {
    connection_param.host = secret.DEPLOY_HOST;
    connection_param.user = secret.DEPLOY_ID;
    connection_param.password = secret.DEPLOY_PW;
}

console.log(connection_param);
const connection = mysql.createConnection(connection_param);
connection.connect();

module.exports = app;
