const express = require('express');
const session = require('express-session');
const router = express.Router();
const config = require('../../config.json');
const database = require('../../controllers/database.js');
const bcrypt = require('bcrypt');
const passport = require('passport');

router.get('/', function(req, res, next) {
  res.render('session/register', {
    pagetitle: "Register"
  });
});

router.post('/', function(req, res, next) {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const passwordconfirm = req.body.passwordconfirm;

  let errors = [];

  // Check if both of the users passwords match.
  if (password !== passwordconfirm) {
    errors.push({ message: "Passwords do not match!" });
  };

  // Check if password is less than 6 characters.
  if (password.length < 6) {
    errors.push({ message: "Your password should be at least 6 characters." });
  };

  if (errors.length > 0) {
    res.render('session/register', {
      pagetitle: "Register",
      errors
    });
  } else {
    // Validation Pass
    database.query(`SELECT COUNT(1) as 'count' FROM webusers WHERE username=?`, [username], function(err, results, fields) {
      if (!results[0].count == 0) {
        // There is already a user with that name.
        errors.push({ message: 'An account already exists with this username.' })
        res.render('session/register', {
          pagetitle: "Register",
          errors
        });
      } else {
        // There is no user with this name.
        bcrypt.genSalt(10, (err, salt) => bcrypt.hash(password, salt, (err, hash) => {
          if (err) throw err;
          database.query(`INSERT INTO webusers (username, email, password) VALUES (?, ?, ?)`, [username, email, hash], function (err, results, fields) {
            if (err) throw err;

            req.flash("successmsg", "You are now registered and can log in.");
            res.redirect('/login');
          });
        }));
      };
    });
  };
});

module.exports = router;
