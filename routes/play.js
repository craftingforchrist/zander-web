const express = require('express');
const router = express.Router();
const config = require('../config.json');
const database = require('../controllers/database.js');

router.get('/', (req, res, next) => {
  database.query (`SELECT * FROM servers WHERE visable = true ORDER BY position ASC;`, function (error, results, fields) {
    if (error) {
      res.redirect('/');
      throw error;
    } else {
      res.render('play', {
        "pagetitle": "Play",
        objdata: results
      });
    };
  });
});

module.exports = router;
