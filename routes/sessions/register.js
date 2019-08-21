const express = require('express');
const router = express.Router();
const config = require('../../config.json');
const database = require('../../controllers/database.js');
const bcrypt = require('bcrypt');
const passport = require('passport');
const saltRounds = 10;

router.get('/', function(req, res, next) {
  res.render('session/register', {
    "servername": `${config.servername}`,
    "sitecolour": `${config.sitecolour}`,
    "email": `${config.email}`,
    "serverip": `${config.serverip}`,
    "website": `${config.website}`,
    "description": `${config.description}`,
    "weblogo": `${config.weblogo}`,
    "webfavicon": `${config.webfavicon}`,
    "pagetitle": "Register"
  });
});

router.post('/', function(req, res, next) {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  database.query(`SELECT COUNT(1) as 'count' FROM webusers WHERE username=?`, [username], function(err, results, fields) {
    if (err) {
      throw err;
    }

    if (!results[0].count == 0) {
      console.log('There is already a user with that name');
      res.redirect('/register');
    } else {
      bcrypt.hash(password, saltRounds, function(err, hash) {
        database.query('INSERT INTO webusers (username, email, password) VALUES (?, ?, ?)', [username, email, hash], function(err, results, fields) {
          if (err) throw err;
          console.log('Creating new user.');

          database.query('SELECT LAST_INSERT_ID() as userid', function(err, results, fields) {
            if (err) throw err;

            const userid = results[0];

            console.log(results[0]);
            req.login(userid, function (err) {
              res.redirect('/');
            });
          });
        });
      });
    }
  });
});

passport.serializeUser(function (userid, done) {
  done(null, userid);
});

passport.deserializeUser(function (userid, done) {
  done(null, userid);
});

module.exports = router;
