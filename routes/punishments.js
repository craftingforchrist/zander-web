const express = require('express');
const router = express.Router();
const config = require('../config.json');
const database = require('../controllers/database.js');

router.get('/', (req, res, next) => {
  database.query (`select p.id as 'id', p.punishtimestamp as 'timestamp', punisher.username as 'punisher', punisher.uuid as 'punisheruuid', punished.username as 'punished', punished.uuid as 'punisheduuid', p.punishtype as 'punishtype', p.reason as 'reason' from gamepunishments p left join playerdata punished on punished.id = p.punisheduser_id left join playerdata punisher on punisher.id = p.punisher_id ORDER BY id DESC; SELECT * FROM discordpunishments;`, function (err, results) {
    if (err) {
      res.redirect('/');
      throw err;
    } else {
      res.render('punishments', {
        pagetitle: "Punishments",
        gamepunishmentsdata: results[0],
        discordpunishmentsdata: results[1]
      });
    };
  });
});

module.exports = router;
