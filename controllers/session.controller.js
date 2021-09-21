
// * -----> store
const store = require('../db/session.db.config');

// * -----> env
const sessionKey = process.env.SESSION_SECRE_KEY;

module.exports = require('express-session')({
    store: store,
    secret: sessionKey,
    proxy: true,
    resave: true,
    saveUninitialized: false
  })