const express = require('express');
const router = express.Router();
const config = require('../../../config.json');
const database = require('../../../controllers/database.js');
const { ensureAuthenticated } = require('../../../controllers/auth.js');
const minecraftapi = require("minecraft-lib");
const Discord = require('discord.js');
const client = new Discord.Client({ disableEveryone: true });
const chalk = require('chalk');

module.exports = (client) => {
  router.get('/', ensureAuthenticated, function(req, res, next) {
    res.render('admin/news/create', {
      pagetitle: "Admin - Create New Article"
    });
  });

  router.post('/', ensureAuthenticated, function(req, res, next) {
  	const title = req.body.title;
  	const author = req.body.author;
  	const content = req.body.content;

    minecraftapi.players.get(req.body.author).then(player => {
      const authoruuid = player.uuid;

      database.query(`INSERT INTO news (title, author, authoruuid, content) VALUES (?, ?, ?, ?);`, [title, author, authoruuid, content], function (err, results, fields) {
        if (err) {
          throw err;
        };

        res.redirect('/admin/news/list');

        if (config.discordsend == true) {
          //
          // Discord Notification Send
          // Requires a #announcements channel to be created.
          //
          let announcementschannel = client.channels.find(c => c.name === 'announcements');
          if (!announcementschannel) return console.log('A #announcements channel does not exist.');

          var embed = new Discord.RichEmbed()
            .setTitle(`New News Article`)
            .setDescription(`A new article has been created by ${author} with the title of ${title}.`)
            .setColor('#00ace6')
          announcementschannel.send(embed);
          console.log(chalk.yellow('[CONSOLE] ') + chalk.blue('[DISCORD] ') + 'News Article has been announced in the Discord.');
        };
      });
    }).catch(console.error);
  });

  return router;
};
