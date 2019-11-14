const express = require('express');
const router = express.Router();
const config = require('../../config.json');
const database = require('../../controllers/database');
const rcon = require('../../controllers/rcon');
const Discord = require('discord.js');
const client = new Discord.Client({ disableEveryone: true });

router.get('/', (req, res, next) => {
  res.render('admin/punishment', {
    "pagetitle": "Administration Panel - Punishment"
  });
});

router.post('/', function (req, res) {
  const platform = req.body.platform;
  const method = req.body.method;
  const username = req.body.username;
  const reason = req.body.reason;

  if (platform === 'server') {
    if (method === 'warn') {
      rcon.send(`warn ${username} ${reason}`);
    }
    if (method === 'kick') {
      rcon.send(`kick ${username} ${reason}`);
    }
    if (method === 'ban') {
      rcon.send(`ban ${username} ${reason}`);
    }
    if (method === 'pardon') {
      rcon.send(`pardon ${username}`);
    }
  }
  res.redirect('/admin/punishment')
});

module.exports = router;
