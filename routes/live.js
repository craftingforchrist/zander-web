const express = require('express');
const router = express.Router();
const config = require('../config.json');
const database = require('../controllers/database.js');

router.get('/', (req, res, next) => {
  database.query (`SELECT * FROM ccstreams WHERE status = "ONLINE" ORDER BY viewercount DESC;`, function (error, results, fields) {
    if (error) {
      throw error;
      res.render('errorviews/500', {
        "pagetitle": "500: Internal Server Error"
      });
      return;
    } else {
      res.render('live', {
        "pagetitle": "Live",
        objdata: results
      });
    };
  });
});

module.exports = router;
