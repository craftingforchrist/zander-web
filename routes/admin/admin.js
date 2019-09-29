const express = require('express');
const router = express.Router();
const config = require('../../config.json');
const rcon = require('../../controllers/rcon.js');
const Discord = require('discord.js');
const client = new Discord.Client({ disableEveryone: true });
const broadcast = require('../../functions/broadcast');
const whitelist = require('../../functions/whitelist');

module.exports = (client) => {
  router.get('/', function(req, res, next) {
    res.render('admin/admin', {
      "pagetitle": "Administration Panel"
    });
  });

  router.post('/', function (req, res) {
    const action = req.body.action;
    const method = req.body.method;
    const username = req.body.username;
    const platform = req.body.platform;
    const reason = req.body.reason;
    const message = req.body.message;

    console.log(req.body);

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
    };

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

  return router;
};
