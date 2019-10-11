const express = require('express');
const router = express.Router();
const config = require('../../config.json');
const database = require('../../controllers/database.js');

router.get('/', function(req, res, next) {
  res.render('session/login', {
    "pagetitle": "Login"
  });
});

router.post('/', (req, res, next) => {
});

module.exports = router;
