const express = require('express');
const router = express.Router();
const config = require('../../config.json');
const database = require('../../controllers/database.js');
const passport = require('passport');

router.get('/', function(req, res, next) {
  if (!req.session.user) {
    res.locals.info = null;
    res.locals.success = null;
    res.render('session/login', {
      setValue: false,
      "pagetitle": "Login"
    });
  } else {
    res.render('errorviews/500', {
      "pagetitle": "500: Internal Server Error"
    });
    return;
  };
});

router.post('/', function (req,res,next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      console.log('Error')
      res.locals.info = null;
      res.locals.success= null;
      res.render('session/login', {
        "pagetitle": "Login",
        setValue: true,
        message: info.message
      });
    }
    if (user) {
        database.query("SELECT id, username from accounts where username = ?", [req.body.username], function (err, result, fields) {
          if (err) {
            res.send("No such user found");
          } else {
            console.log(`[CONSOLE] [ADMIN] ${result[0].username} has logged in.`);

            req.session.user = result[0].id;
            if (req.session.user) {
              res.locals.info = true;
            } else {
              res.locals.info = false;
            }
            res.redirect('/admin/dashboard');
          }
        });
      } else {
        console.log('Other Error')
        res.render('session/login', {
          setValue: true,
          message: info.message,
          "pagetitle": "Login"
        });
      }
  })(req, res, next);
})

module.exports = router;
