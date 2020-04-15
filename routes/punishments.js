const express = require('express');
const router = express.Router();
const config = require('../config.json');
const abdatabase = require('../controllers/abdatabase.js');

router.get('/', (req, res, next) => {
  abdatabase.query (`SELECT * FROM advancedban.punishmenthistory order by id desc;`, function (err, results) {
    if (err) {
      res.redirect('/');
      throw err;
    } else {
      res.render('punishments', {
        pagetitle: "Punishments",
        gamepunishdata: results
      });
    };
  });
});

module.exports = router;
