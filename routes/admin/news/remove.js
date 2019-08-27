const express = require('express');
const router = express.Router();
const config = require('../../../config.json');
const database = require('../../../controllers/database.js');
const { ensureAuthenticated } = require('../../../controllers/auth.js');

router.get('/', ensureAuthenticated, function(req, res, next) {
  database.query('DELETE FROM news WHERE (id=?)', [req.query.id], function(err, results, fields) {
    if (err) {
      throw err;
    }

    res.redirect('/admin/news/list');
  });
});

module.exports = router;
