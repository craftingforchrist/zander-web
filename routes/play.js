const express = require('express');
const router = express.Router();
const config = require('../config.json');
const database = require('../controllers/database.js');

router.get('/', (req, res, next) => {
  database.query (`SELECT * FROM servers WHERE visable = true ORDER BY position ASC;`, function (error, results, fields) {
    if (error) {
      throw error;
      res.render('errorviews/500', {
        "pagetitle": "500: Internal Server Error"
      });
      return;
    } else {
      res.render('play', {
        "pagetitle": "Play",
        objdata: results
      });
    };
  });
});

module.exports = router;
