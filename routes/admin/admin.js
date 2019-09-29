const express = require('express');
const router = express.Router();
const config = require('../../config.json');
const rcon = require('../../controllers/rcon.js');
const Discord = require('discord.js');
const client = new Discord.Client({ disableEveryone: true });

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
        rcon.send(`whitelist add ${username}`);
      } else if (method === "remove") {
        rcon.send(`whitelist remove ${username}`);
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
        let broadcastchannel = client.channels.find(c => c.name === `${config.broadcastchannel}`);
        if (!broadcastchannel) return console.log('A broadcast channel does not exist.');

        var embed = new Discord.RichEmbed()
          .setTitle('Platform Broadcast')
          .setDescription(`${message}`)
          .setColor('#FFA500')
        broadcastchannel.send(embed);
      };
      res.redirect('/admin');
    };
  });

  return router;
};
