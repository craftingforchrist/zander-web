const express = require('express');
const moment = require('moment');
const router = express.Router();
const config = require('../config.json');
const database = require('../controllers/database.js');

router.get('/', (req, res, next) => {
  database.query (`SELECT COUNT(*) as ccstreamslive FROM ccstreams WHERE status = "ONLINE"; SELECT * FROM events ORDER BY eventdatetime DESC LIMIT 1;`, function (error, results, fields) {
    if (error) {
      res.redirect('/');
      throw error;
    } else {
      res.render('index', {
        "pagetitle": "Home",
        objdata: results,
        event: results[1][0],
        moment: moment
      });
    };
  });
});

module.exports = router;
