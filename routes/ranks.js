const express = require('express');
const router = express.Router();
const config = require('../config.json');
const database = require('../controllers/database.js');

router.get('/', (req, res, next) => {
  res.render('ranks', {
    "pagetitle": "Ranks"
  });
});

module.exports = router;
