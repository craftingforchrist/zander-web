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
    database.query (`SELECT * FROM gameapplications WHERE appstatus='PROCESSING';`, function (error, results, fields) {
      if (error) {
        res.redirect('/');
        throw error;
      } else {
        res.render('admin/admin', {
          "pagetitle": "Administration Panel",
          objdata: results
        });
        // console.log(results);
      }
    });
  });

  router.post('/', function (req, res) {
    const action = req.body.action;
    const method = req.body.method;
    const username = req.body.username;
    const platform = req.body.platform;
    const reason = req.body.reason;
    const message = req.body.message;
    const id = req.body.id;

    console.log(req.body);

    //
    // Application
    //
    if (action === "applyaccept") {
      applystatus.accept(id, req, res);
    };

    if (action === "applydeny") {
      applystatus.deny(id, req, res);
    };

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
