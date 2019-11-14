const express = require('express');
const router = express.Router();
const config = require('../../config.json');
const database = require('../../controllers/database');
const rcon = require('../../controllers/rcon');

router.get('/', (req, res, next) => {
  res.render('admin/whitelist', {
    "pagetitle": "Administration Panel - Whitelist"
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
    res.redirect('/admin/whitelist');
  };;
});

module.exports = router;
