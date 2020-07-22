const express = require('express');
const router = express.Router();
const config = require('../../config.json');
const database = require('../../controllers/database');
// const rcon = require('../../controllers/rcon');
const Discord = require('discord.js');
const client = new Discord.Client({ disableEveryone: true });

router.get('/', (req, res, next) => {
  console.log(req.session.user)
  if(req.session.user) {
    res.render('admin/punishment', {
      "pagetitle": "Administration Panel - Punishment"
    });
  }
  else {
    res.render('session/login', {
      setValue: true,
      message: 'You cannot access this page unless you are logged in.',
      "pagetitle": "Login"
    });
  }
});

router.post('/', function (req, res) {
  if(req.session.user) {
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
  } else{
    res.render('session/login', {
      setValue: true,
      message: 'You cannot access this page unless you are logged in.',
      "pagetitle": "Login"
    });
  }
});

module.exports = router;
