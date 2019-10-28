const express = require('express');
const router = express.Router();
const config = require('../../config.json');
const database = require('../../controllers/database.js');
const accounts = require('../../functions/admin/accounts.js');

router.get('/', (req, res, next) => {
  res.render('admin/broadcast', {
    "pagetitle": "Administration Panel - Broadcast"
  });
});

router.post('/', function (req, res) {
  const action = req.body.action;
  const method = req.body.method;
  const message = req.body.message;

  //
  // Broadcast
  //
  if (action === "broadcast") {
    if (method === "discord") {
      broadcast.discord(message);
    };
    res.redirect('/admin');
  };
});

module.exports = router;
