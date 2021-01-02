const express = require('express');
const moment = require('moment');
const router = express.Router();
const config = require('../config.json');
const database = require('../controllers/database.js');

router.get('/', (req, res, next) => {
  let sql = `SELECT COUNT(*) as ccstreamslive FROM ccstreams WHERE status = "ONLINE";
  SELECT * FROM events ORDER BY eventdatetime DESC LIMIT 1;
  SELECT * FROM servers WHERE visable = true ORDER BY position ASC;
  SELECT * FROM zander.indexslides WHERE visable = TRUE ORDER BY position ASC;`

  database.query (sql, function (error, results, fields) {
    if (error) {
      throw error;
      res.render('errorviews/500', {
        "pagetitle": "500: Internal Server Error"
      });
      return;
    } else {
      res.render('index', {
        "pagetitle": "Home",
        objdata: results,
        event: results[1][0],
        servers: results[2],
        indexslides: results[3],
        moment: moment
      });
    };
  });
});

module.exports = router;
