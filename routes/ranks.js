const express = require('express');
const router = express.Router();
const config = require('../config.json');
const lpdatabase = require('../controllers/lpdatabase.js');

router.get('/', (req, res, next) => {
  lpdatabase.query (`SELECT uuid, (SELECT username FROM luckperms_players WHERE luckperms_players.uuid = luckperms_user_permissions.uuid) as username, permission FROM luckperms_user_permissions WHERE permission LIKE 'group.%';`, function (error, results, fields) {
    if (error) {
      res.redirect('/');
      throw error;
    } else {
      res.render('ranks', {
        "pagetitle": "Ranks",
        objdata: results
      });
    }
  });
});

module.exports = router;
