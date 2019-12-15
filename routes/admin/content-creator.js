const express = require('express');
const router = express.Router();
const config = require('../../config.json');
const database = require('../../controllers/database.js');
const broadcast = require('../../functions/broadcast');

router.get('/', (req, res, next) => {
  if (req.session.user) {
  res.render('admin/content-creator', {
    "pagetitle": "Administration Panel - Content Creator"
  });
  } else {
    res.render('session/login', {
      setValue: true,
      message: 'You cannot access this page unless you are logged in.',
      "pagetitle": "Login"
    });
  }
});

router.post('/', function (req, res) {
  if (req.session.user) {

  } else {
    res.render('session/login', {
      setValue: true,
      message: 'You cannot access this page unless you are logged in.',
      "pagetitle": "Login"
    });
  };
});

module.exports = router;
