const localstrategy = require('passport-local');
const database = require('./database.js');
const bcrypt = require('bcrypt');

module.exports = function(passport) {
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

  passport.serializeUser((userid, done) => {
    done(null, userid);
  });

  passport.deserializeUser((userid, done) => {
    done(null, userid);
  });
};
