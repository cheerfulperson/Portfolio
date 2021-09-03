const
  express = require('express'),
  createError = require('http-errors'),
  cookieParser = require('cookie-parser'),
  logger = require('morgan'),
  sassMiddleware = require('node-sass-middleware'),
  hbs = require('handlebars'),
  expressHbs = require('express-handlebars'),
  compress = require('compression'),
  { join } = require('path'),
  { readFileSync, readdirSync } = require('fs');

require('dotenv').config();

let app = express();

// * -----> store
const store = require('./db/session.db.config');

// * -----> routes 
const
  indexRouter = require('./routes/router');
  usersRouter = require('./routes/users');

// * -----> env
const sessionKey = process.env.SESSION_SECRE_KEY;

// * -----> view engine setup
var hbsOptions = {
  extname: 'hbs',
  defaultView: 'default',
  defaultLayout: __dirname + '/views/layout',
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/',
  helpers: {
    isVideo: (type) => {
      return type === 'video' ? true : false;
    }
    // avatars: 
  }
}

app.engine('hbs', expressHbs(hbsOptions));
app.set('view engine', 'hbs');

app.use(logger('dev', {
  skip: function (req, res) { return res.statusCode < 400 }
}));
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
app.use(compress());
app.use(express.static(join(__dirname, 'public'), {redirect: true}));
app.use(require('express-session')({
  store: store,
  secret: sessionKey,
  proxy: true,
  resave: true,
  saveUninitialized: false
}))
app.use((req, res, next) => {
  

    hbs.registerHelper('setParams', (block) => {

      if(req.session && req.session.user){
        block.data.root.isThereASession = true;
        block.data.root.userData = req.session.user;
        block.data.root.avatars = readdirSync(join(__dirname, '/public/media/images/avatars')).map(el => {return `/media/images/avatars/${el}`});
      }else{
        block.data.root.isThereASession = false;
        block.data.root.userData = null;
        block.data.root.avatars = null;
      }

    })

  req.siteDescription = JSON.parse(readFileSync(__dirname + '/site-description.json', 'utf-8'));
  next();
})

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