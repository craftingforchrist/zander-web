const express = require('express');
const router = express.Router();
const config = require('../../../config.json');
const database = require('../../../controllers/database.js');
const accounts = require('../../../functions/admin/accounts.js');

router.get('/', (req, res, next) => {
  if (req.session.user) {
    database.query(`SELECT * FROM ccstreams; SELECT * FROM ccvideos;`, function (error, results, fields) {
      if (error) {
        throw error;
        res.render('errorviews/500', {
          "pagetitle": "500: Internal Server Error"
        });
        return;
      } else {
        res.render('admin/contentcreator', {
          "pagetitle": "Administration Panel - Content Creator",
          ccstreamsdata: results[0],
          ccvideosdata: results[1]
        });
      };
    });
  } else {
    res.render('session/login', {
      setValue: true,
      message: 'You cannot access this page unless you are logged in.',
      "pagetitle": "Login"
    });
  };
});

router.post('/', function (req, res) {
  if (req.session.user) {

  } else {
    res.render('session/login', {
      setValue: true,
      message: 'You cannot access this page unless you are logged in.',
      "pagetitle": "Login"
    });
  };
});

module.exports = router;
