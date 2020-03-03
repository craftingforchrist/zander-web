const express = require('express');
const router = express.Router();
const config = require('../../../config.json');
const database = require('../../../controllers/database.js');
const accounts = require('../../../functions/admin/accounts.js');
const bcrypt = require('bcryptjs');

router.post('/', function (req, res) {
  if (req.session.user) {
    const username = req.body.username;
    const password = req.body.password;
    const saltrounds = 10;

    bcrypt.hash(password, saltrounds, function (err, hash) {
      accounts.addaccount(username, hash);
    });
    
    res.redirect('/admin/accounts');
  } else {
    res.render('session/login', {
      setValue: true,
      message: 'You cannot access this page unless you are logged in.',
      "pagetitle": "Login"
    });
  }
});

module.exports = router;
