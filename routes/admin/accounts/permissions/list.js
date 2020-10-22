const express = require('express');
const router = express.Router();
const config = require('../../../../config.json');
const database = require('../../../../controllers/database.js');

router.get('/', (req, res, next) => {
  if (req.session.user) {
    database.query(`SELECT * FROM accounts;`, function (error, results, fields) {
      if (error) {
        res.render('errorviews/500', {
          "pagetitle": "500: Internal Server Error"
        });
        return;
        throw error;
      } else {
        res.render('admin/accounts/permissions', {
          "pagetitle": "Administration Panel - Account Permissions",
          objdata: results
        });
      }
    });
  } else {
    res.render('session/login', {
      setValue: true,
      message: 'You cannot access this page unless you are logged in.',
      "pagetitle": "Login"
    });
  }
});

router.post('/', function (req, res) {
  if (req.session.user) {

  } else {
    res.render('session/login', {
      setValue: true,
      message: 'You cannot access this page unless you are logged in.',
      "pagetitle": "Login"
    });
  }
});

module.exports = router;
