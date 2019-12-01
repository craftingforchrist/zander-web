const express = require('express');
const router = express.Router();
const config = require('../../config.json');
const db = require('../../controllers/database.js');
const passport = require('passport');

router.get('/', function(req, res, next) {
  if(!req.session.user) {
    res.locals.info = null;
    res.locals.success = null;
    res.render('session/login', {
      setValue: false,
      "pagetitle": "Login"
    });
  }
  else{
    res.render('index', {
      "pagetitle": "Home"
    });
  }
});

router.post('/', function(req,res,next){
  console.log(req.body.username)
  passport.authenticate("local", function(err, user, info) {
    if (err) {
      console.log('Error')
      res.locals.info = null;
      res.locals.success=null;
      res.render('session/login', {
        "pagetitle": "Login",
        setValue: true,
        message: info.message
      });
    }
    if (user) {
        let queryString = "SELECT id from accounts where username = ?";
        db.query(queryString, [req.body.username], function (err, result, fields) {
          if (err) {
            res.send("No such user found");
          }
          else {
            console.log('User Logged in successfully');
            req.session.user = result[0].id;
            if(req.session.user){
              res.locals.info = true;
            }
            else{
              res.locals.info = false;
            }
            res.render('index', {
              "pagetitle": "Home"
            });
          }
        });
      }
      else{
      console.log('Other Error')
      res.render('session/login', {
        setValue: true,
        message: info.message,
        "pagetitle": "Login"
      });
      }
  })(req, res,next);
})

module.exports = router;
