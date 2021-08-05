const
  express = require('express'),
  createError = require('http-errors'),
  cookieParser = require('cookie-parser'),
  logger = require('morgan'),
  sassMiddleware = require('node-sass-middleware'),
  expressHbs = require('express-handlebars'),
  { join } = require('path');

let app = express();

// routes 
const
  indexRouter = require('./routes/index');
  usersRouter = require('./routes/users');

// env
const key = process.env.MYKEY;

// view engine setup
app.engine('hbs', expressHbs({
  extname: 'hbs',
  defaultView: 'default',
  defaultLayout: __dirname + '/views/layout',
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/',
}));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(sassMiddleware({
  src: join(__dirname, 'public'),
  dest: join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;