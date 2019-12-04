const express = require('express');
const router = express.Router();
const config = require('../config.json');
const lpdatabase = require('../controllers/lpdatabase.js');

router.get('/', (req, res, next) => {
  lpdatabase.query (`SELECT * FROM luckperms.luckperms_players; SELECT primary_group, count(*) AS count FROM luckperms.luckperms_players GROUP BY primary_group;`, function (error, results, fields) {
    if (error) {
      res.redirect('/');
      throw error;
    } else {
      res.render('staff', {
        "pagetitle": "Staff",
        objdata: results
      });

      console.log(results[0][0].primary_group);
    }
  });
});

module.exports = router;
