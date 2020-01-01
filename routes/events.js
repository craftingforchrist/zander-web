const express = require('express');
const router = express.Router();
const config = require('../config.json');
const database = require('../controllers/database.js');

router.get('/', (req, res, next) => {
  database.query (`SELECT * FROM events ORDER BY id DESC;`, function (error, results, fields) {
    if (error) {
      res.redirect('/');
      throw error;
    } else {
      res.render('events', {
        "pagetitle": "Events",
        objdata: results
      });
    };
  });
});

module.exports = router;
