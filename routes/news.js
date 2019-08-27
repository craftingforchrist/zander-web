const express = require('express');
const router = express.Router();
const config = require('../config.json');
const database = require('../controllers/database.js');

router.get('/', (req, res, next) => {
  database.query('select * from news order by id desc;', function (err, results, fields) {
    if (err) {
      res.redirect('/');
      throw err;
    };

    res.render('news', {
      pagetitle: "News",
      objdata: results
    });
  });
});

module.exports = router;
