const express = require('express');
const router = express.Router();
const config = require('../../config.json');
const database = require('../../controllers/database.js');
const accounts = require('../../functions/admin/accounts.js');

router.get('/', (req, res, next) => {
  database.query (`SELECT * FROM gameapplications WHERE appstatus='PROCESSING';`, function (error, results, fields) {
    if (error) {
      res.redirect('/');
      throw error;
    } else {
      res.render('admin/whitelist', {
        "pagetitle": "Administration Panel - Whitelist",
        objdata: results
      });
    }
  });
});

router.post('/', function (req, res) {
  const action = req.body.action;
  const method = req.body.method;
  const username = req.body.username;

  //
  // Whitelist
  //
  if (action === "whitelist") {
    if (method === "add") {
      whitelist.add(username);
    } else if (method === "remove") {
      whitelist.remove(username);
    };
    res.redirect('/admin');
  };;
});

module.exports = router;
