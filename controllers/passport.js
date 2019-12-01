const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../controllers/database.js');
const bcrypt = require('bcryptjs');

module.exports = function (passport) {
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
    },
        (username, password, done) => {
            let queryString = 'SELECT password FROM accounts where username = ?';
            db.query(queryString, [username], function (err, result, fields) {
                console.log(result)
                try {
                    if (err)
                        return done(err);
                    else if (result.length == 0)
                        return done(null, false, { message: 'Username or password is not correct.' });
                    else if (!(result[0].password == password))
                        return done(null, false, { message: 'Username or password is not correct.' });
                    else
                        return done(null, result);
                }
                catch (err) {
                    return done(err);
                }
            });
        }
    ));
};
