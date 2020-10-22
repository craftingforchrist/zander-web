const express = require('express');
const moment = require('moment');
const router = express.Router();
const config = require('../config.json');
const database = require('../controllers/database.js');

router.get('/', (req, res, next) => {
  database.query (`SELECT * FROM events ORDER BY eventdatetime DESC;`, function (error, results, fields) {
    if (error) {
      throw error;
      res.render('errorviews/500', {
        "pagetitle": "500"
      });
      return;
    } else {
      res.render('events', {
        "pagetitle": "Events",
        results: results,
        moment: moment
      });
    };
  });
});

module.exports = router;
