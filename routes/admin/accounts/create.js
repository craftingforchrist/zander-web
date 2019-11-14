const express = require('express');
const router = express.Router();
const config = require('../../../config.json');
const database = require('../../../controllers/database.js');
const accounts = require('../../../functions/admin/accounts.js');
const bcrypt = require('bcrypt');

router.post('/', function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const saltrounds = 10;

  bcrypt.hash(password, saltrounds, function(err, hash) {
    accounts.addaccount(username, hash);
  });

  console.log(req.body);

  res.redirect('/admin/accounts');
});

module.exports = router;
