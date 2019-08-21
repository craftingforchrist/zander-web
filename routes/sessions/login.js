const express = require('express');
const router = express.Router();
const config = require('../../config.json');
const passport = require('passport');
const database = require('../../controllers/database.js');
const localstrategy = require('passport-local');
const bcrypt = require('bcrypt');

router.get('/', function(req, res, next) {
  res.render('session/login', {
    "servername": `${config.servername}`,
    "sitecolour": `${config.sitecolour}`,
    "email": `${config.email}`,
    "serverip": `${config.serverip}`,
    "website": `${config.website}`,
    "description": `${config.description}`,
    "weblogo": `${config.weblogo}`,
    "webfavicon": `${config.webfavicon}`,
    "pagetitle": "Login"
  });
});

router.post('/', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

passport.use(new localstrategy (function (username, password, done) {
  database.query('SELECT id, password from webusers WHERE username=?', [username], function(err, results, fields) {
    if (err) {
      done(err);
    };

    if (results.length === 0) {
      done(null, false);
    } else {
      const hash = results[0].password.toString();
      bcrypt.compare(password, hash, function(err, response) {
        if (response == true) {
          return done(null, {userid: results[0].id});
        } else {
          return done(null, false);
        };
      });
    }
  });
}));

module.exports = router;
