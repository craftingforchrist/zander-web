const express = require('express');
const router = express.Router();
const config = require('../../config.json');
const database = require('../../controllers/database.js');
const passport = require('passport');

router.get('/', function(req, res, next) {
  res.render('session/login', {
    "pagetitle": "Login"
  });
});

router.post('/', passport.authenticate('local', {
  successRedirect: '/admin',
  failureRedirect: '/'
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  done(err, user);
});

module.exports = router;
