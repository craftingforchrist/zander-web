const express = require('express');
const router = express.Router();
const config = require('../../../config.json');
const database = require('../../../controllers/database.js');
const { ensureAuthenticated } = require('../../../controllers/auth.js');

router.get('/', ensureAuthenticated, function (req, res, next) {
  database.query('select * from news order by id desc;', function (err, results, fields) {
    if (err) {
      throw err;
    }

    res.render('admin/news/list', {
      pagetitle: "List all Articles",
      objdata: results
    });
  });
});

module.exports = router;
