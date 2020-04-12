const express = require('express');
const router = express.Router();
const config = require('../config.json');
const abdatabase = require('../controllers/abdatabase.js');

router.get('/', (req, res, next) => {
  abdatabase.query (`SELECT * FROM advancedban.punishmenthistory order by id desc; SELECT username, uuid FROM zander.playerdata;`, function (err, results) {
    if (err) {
      res.redirect('/');
      throw err;
    } else {
      res.render('punishments', {
        pagetitle: "Punishments",
        gamepunishdata: results[0]
      });
      console.log(results[1]);
    };
  });
});

module.exports = router;
