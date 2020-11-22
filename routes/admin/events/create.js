const express = require('express');
const router = express.Router();
const config = require('../../../config.json');
const HexColour = require('../../../HexColour.json');
const database = require('../../../controllers/database.js');
const Discord = require('discord.js');
const client = new Discord.Client({ disableEveryone: true });
const moment = require('moment');

module.exports = (client) => {
  router.get('/', function (req, res, next) {
    if (req.session.user) {
      res.render('admin/events/create', {
        "pagetitle": "Administration Panel - Create Event",
        moment: moment
      });
    } else {
      res.render('session/login', {
        setValue: true,
        message: 'You cannot access this page unless you are logged in.',
        "pagetitle": "Login"
      });
    }
  });

  router.post('/', function (req, res) {
    if (req.session.user) {
      const title = req.body.title;
      const icon = req.body.icon;
      const datetime = req.body.eventdatetime;
      const information = req.body.information;

      database.query(`INSERT INTO events (title, icon, eventdatetime, information) VALUES (?, ?, ?, ?)`, [title, icon, datetime, information], function (error, results, fields) {
        if (error) {
          throw error;
          res.render('errorviews/500', {
            "pagetitle": "500: Internal Server Error"
          });
          return;
        } else {
          res.redirect('/admin/events');

          // Take event that was just created and announce it to Discord.
          let eventschannel = client.channels.cache.find(c => c.name === `${config.eventschannel}`);
          if (!eventschannel) return console.log(`A #${config.eventschannel} channel does not exist.`);

          var embed = new Discord.MessageEmbed()
            .setTitle(title)
            .setDescription(`${moment(datetime).format('LLLL')}\n\n${information}`)
            .setThumbnail(icon)
            .setColor(HexColour.evententry)
          eventschannel.send(embed);
          console.log(`[CONSOLE] [DISCORD] The new Event has been broadcasted to Discord.`);
        };
      });
    } else {
      res.render('session/login', {
        setValue: true,
        message: 'You cannot access this page unless you are logged in.',
        "pagetitle": "Login"
      });
    }
  });

  return router;
};
