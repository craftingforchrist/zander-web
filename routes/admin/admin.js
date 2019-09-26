const express = require('express');
const router = express.Router();
const config = require('../../config.json');
const database = require('../../controllers/database.js');
const rcon = require('../../controllers/rcon.js');

router.get('/', function(req, res, next) {
  res.render('admin/admin', {
    "pagetitle": "Administration Panel"
  });
});

router.post('/', function (req, res) {
  const action = req.body.action;
  const method = req.body.method;
  const username = req.body.username;

  console.log(req.body);

  if (action == "whitelist") {
    if (method == "add") {
      rcon.send(`whitelist add ${username}`);
    };
  };
});

module.exports = router;
