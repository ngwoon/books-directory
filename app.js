var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const session = require("express-session");
const FileStore = require('session-file-store')(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var docRouter = require('./routes/document');

// constants
const SESSION_EXPIRE_MILLI = 10000; // 테스트를 위해 세션 만료 시간을 10초로 설정
const EXPIRED_SESSION_CLEAR_TIME = 10; // 테스트를 위해 만료된 세션 정리 시간을 10초로 설정

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(require('node-sass-middleware')({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    sourceMap: true,
    outputStyle: 'compressed'
})); 
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// session setting
const fileStoreOptions = {
    path: "./sessions", // default path
    reapInterval: EXPIRED_SESSION_CLEAR_TIME, // interval that delete expired sessions
}

app.use(session({  // 2
    secret: 'keyboard cat',  // 암호화
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: SESSION_EXPIRE_MILLI,
    },
    store: new FileStore(fileStoreOptions),
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
