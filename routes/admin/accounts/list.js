const express = require('express');
const router = express.Router();
const config = require('../../../config.json');
const database = require('../../../controllers/database.js');
const accounts = require('../../../functions/admin/accounts.js');

router.get('/', (req, res, next) => {
  database.query (`SELECT * FROM accounts;`, function (error, results, fields) {
    if (error) {
      res.redirect('/');
      throw error;
    } else {
      res.render('admin/accounts', {
        "pagetitle": "Administration Panel - Accounts",
        objdata: results
      });
    }
  });
});

router.post('/', function (req, res) {
  const action = req.body.action;
  const id = req.body.id;

  if (action === "accountdelete") {
    accounts.deleteaccount(id);
    res.redirect('/admin/accounts/list');
  };
});

module.exports = router;
