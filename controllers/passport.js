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

      // Check if the users account exists.
      database.query("SELECT username FROM accounts where username = ?", [username], function (err, result, fields, res) {
        if (err) {
          throw err;
        };

        if (result < 1) {
          console.log("There was no account found.");
          return done(null, false, { message: "The username or password is not correct." });
        } else {
          // Check if the users account is disabled.
          database.query("SELECT status FROM accounts where username = ?", [username], function (err, result, fields, res) {
            if (result[0].status == "DISABLED") {
              return done(null, false, { message: "This account has been disabled. If this has been wrongfully disabled, email our support team." });
            };
          });

          // Check if the users password matches to the hashed password in the database.
          database.query("SELECT password FROM accounts where username = ?", [username], function (err, result, fields) {
            if (!result[0]) {
              return done(null, false, { message: "The username or password is not correct." });
            } else {
              if (result[0].password) {
                let hashedpassword = result[0].password;
                bcrypt.compare(password, hashedpassword, function(err, response) {
                  if (response == true) {
                    return done(null, result);
                  } else {
                    return done(null, false, { message: 'The username or password is not correct.' });
                  }
                });
              };
            };
          });
        };
      });
    }
  ));
};
