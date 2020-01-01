const express = require('express');
const router = express.Router();
const config = require('../../../config.json');
const database = require('../../../controllers/database.js');
const Discord = require('discord.js');
const client = new Discord.Client({ disableEveryone: true });


module.exports = (client) => {
  router.post('/', function (req, res) {
    if (req.session.user) {
      const name = req.body.name;
      const icon = req.body.icon;
      const date = req.body.date;
      const time = req.body.time;
      const information = req.body.information;

      console.log(req.body);

      database.query(`INSERT INTO events (eventtitle, eventicon, eventdate, eventtime, eventinformation) VALUES (?, ?, ?, ?, ?)`, [name, icon, date, time, information], function (error, results, fields) {
        if (error) {
          res.redirect('/');
          throw error;
        } else {
          res.redirect('/admin/events');

          // Take event that was just created and announce it to Discord.
          let eventschannel = client.channels.find(c => c.name === `${config.eventschannel}`);
          if (!eventschannel) return console.log(`A #${config.eventschannel} channel does not exist.`);

          var embed = new Discord.RichEmbed()
            .setTitle(name)
            .setDescription(`**Date & Time: **${date} @ ${time}\n\n**Event Information: **${information}`)
            .setThumbnail(icon)
            .setColor('#99ddff')
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
