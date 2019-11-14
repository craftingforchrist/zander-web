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

router.get('/', (req, res, next) => {
  res.render('admin/punishment', {
    "pagetitle": "Administration Panel - Punishment"
  });
});

router.post('/', function (req, res) {

});

module.exports = router;
