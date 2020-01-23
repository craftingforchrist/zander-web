const express = require('express');
const router = express.Router();
const config = require('../../../config.json');
const database = require('../../../controllers/database.js');
const Discord = require('discord.js');
const client = new Discord.Client({ disableEveryone: true });

router.post('/', function (req, res) {
  if (req.session.user) {
    const action = req.body.action;
    const type = req.body.type;
    const channelname = req.body.channelname;
    const channellink = req.body.channellink;

    if (action == 'add') {
      if (type == 'streamer') {
        database.query(`INSERT INTO ccstreams (channelname, channellink, streamtitle, status) VALUES (?, ?, ?, ?)`, [channelname, channellink, "Not Yet Updated", "OFFLINE"], function (error, results, fields) {
          if (error) {
            res.redirect('/');
            throw error;
          } else {
            res.redirect('/admin/contentcreator');
          };
        });
      } else if (type == 'channel') {
        database.query(`INSERT INTO ccvideos (channelname, channellink) VALUES (?, ?, ?, ?)`, [channelname, channellink], function (error, results, fields) {
          if (error) {
            res.redirect('/');
            throw error;
          } else {
            res.redirect('/admin/contentcreator');
          };
        });
      }
    }
  } else {
    res.render('session/login', {
      setValue: true,
      message: 'You cannot access this page unless you are logged in.',
      "pagetitle": "Login"
    });
  }
});

module.exports = router;
