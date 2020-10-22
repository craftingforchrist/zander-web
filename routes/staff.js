const express = require('express');
const router = express.Router();
const config = require('../config.json');
const lpdatabase = require('../controllers/lpdatabase.js');
const database = require('../controllers/database.js');

router.get('/', (req, res, next) => {
  database.query (`select uuid, username from playerdata;`, function (error, zanderresults, fields) {
    if (error) {
      res.render('errorviews/500', {
        "pagetitle": "500: Internal Server Error"
      });
      return;
      throw error;
    } else {
      lpdatabase.query (`SELECT uuid, (SELECT username FROM luckperms_players WHERE luckperms_players.uuid = luckperms_user_permissions.uuid) as username, permission, title FROM luckperms_user_permissions WHERE permission LIKE 'group.%';`, function (error, lpresults, fields) {
        if (error) {
          res.render('errorviews/500', {
            "pagetitle": "500: Internal Server Error"
          });
          return;
          throw error;
        } else {
          res.render('staff', {
            "pagetitle": "Staff",
            lpresults: lpresults,
            zanderresults: zanderresults
          });
        }
      });
    }
  });
});

module.exports = router;
