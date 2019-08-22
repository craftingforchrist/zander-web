const express = require('express');
const router = express.Router();
const config = require('../../config.json');
const passport = require('passport');
const database = require('../../controllers/database.js');
const localstrategy = require('passport-local');
const bcrypt = require('bcrypt');

router.get('/', function(req, res, next) {
  res.render('session/login', {
    "pagetitle": "Login"
  });
});

router.post('/', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

module.exports = router;
