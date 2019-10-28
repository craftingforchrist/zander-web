const express = require('express');
const router = express.Router();
const config = require('../../config.json');
const database = require('../../controllers/database');
const rcon = require('../../controllers/rcon');
const Discord = require('discord.js');
const client = new Discord.Client({ disableEveryone: true });
const broadcast = require('../../functions/broadcast');
const whitelist = require('../../functions/whitelist');
const applystatus = require('../../functions/apply/applystatus');

module.exports = (client) => {
  router.get('/', function(req, res, next) {
      res.render('admin/punishment', {
        "pagetitle": "Administration Panel - Punishment"
      });
  });

  router.post('/', function (req, res) {
    const action = req.body.action;
    const method = req.body.method;
    const username = req.body.username;
    const platform = req.body.platform;
    const reason = req.body.reason;

    //
    // Punishment
    //
    if (action === "punish") {
      if (platform === "server") {
        if (method === "warn") {
          rcon.send(`warn ${username} ${reason}`);
          res.redirect('/admin');
        }
      };
    };
  });

  return router;
};
