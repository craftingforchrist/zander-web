const express = require('express');
const router = express.Router();
const config = require('../config.json');
const database = require('../controllers/database.js');

router.get('/', (req, res, next) => {
  database.query (`SELECT * FROM playerdata; SELECT pd.username as 'username', COUNT(ses.id) as 'joins' FROM gamesessions ses left join playerdata pd on pd.id = ses.player_id group by pd.username;`, function (error, results, fields) {
    if (error) {
      throw error;
      res.render('errorviews/500', {
        "pagetitle": "500: Internal Server Error"
      });
      return;
    } else {
      res.render('players', {
        "pagetitle": "Players",
        objdata: results
      });
    }
  });
});

module.exports = router;
