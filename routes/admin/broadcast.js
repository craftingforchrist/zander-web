const express = require('express');
const router = express.Router();
const config = require('../../config.json');
const database = require('../../controllers/database.js');
const broadcast = require('../../functions/broadcast');

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
    res.redirect('/admin/broadcast');
  };
});

module.exports = router;
