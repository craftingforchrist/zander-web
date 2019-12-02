const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const database = require('../controllers/database.js');
const bcrypt = require('bcryptjs');

module.exports = function (passport, req, res) {
    passport.serializeUser(function (user, done) {
        console.log("Serializing user");
        done(null, user[0].username);
    });

    passport.deserializeUser(function (username, done) {
        console.log("Deserializing user");
        done(err, username);
    });
    passport.use('local', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, (username, password, done) => {
      // Check if the users account is disabled.
      database.query("SELECT status FROM accounts where username = ?", [username], function (err, result, fields, res) {
        // TODO: Because the status of the account is disabled, we want to render the login page again to alert the user that it has been disabled.
        // Please refer to https://github.com/benrobson/zander/issues/196
        if (result[0].status == "DISABLED") {
          res.render('session/login', {
            "pagetitle": "Login",
            warningalert: true,
            message: "This account has been disabled. If this has been wrongfully disabled, email our support team: <a href='mailto:<%= contactemail %>'>"
          });
        };
      });


      // Check if the users password matches to the hashed password in the database.
      database.query("SELECT password FROM accounts where username = ?", [username], function (err, result, fields) {
        // TODO: If the User enters in a username and password that is not in the system, the app crashes.
        // Refer to https://github.com/benrobson/zander/issues/195
        if (result[0].password) {
          let hashedpassword = result[0].password;
          bcrypt.compare(password, hashedpassword, function(err, response) {
            if (response == true) {
              return done(null, result);
            } else {
              return done(null, false, { message: 'The username or password is not correct.' });
            }
          });
        } else {
          return done(null, false, { message: 'The username or password is not correct.' });
        };
      });
    }
  ));
};
