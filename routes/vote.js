const express = require('express');
const router = express.Router();
const config = require('../config.json');
const database = require('../controllers/database.js');

router.get('/', (req, res, next) => {
  database.query (`SELECT username, count(*) as votes FROM votes GROUP BY username ORDER BY votes DESC;`, function (error, results, fields) {
    if (error) {
      res.render('errorviews/500', {
        "pagetitle": "500: Internal Server Error"
      });
      return;
      throw error;
    } else {
      res.render('vote', {
        "pagetitle": "Vote",
        objdata: results
      });
    }
  });
});

module.exports = router;
