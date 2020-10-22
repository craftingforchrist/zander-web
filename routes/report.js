const express = require('express');
const router = express.Router();
const config = require('../config.json');
const Discord = require('discord.js');
const client = new Discord.Client({ disableEveryone: true });

module.exports = (client) => {
  router.get('/', (req, res, next) => {
    res.render('report', {
      "pagetitle": "Report A Player"
    });
  });

  router.post('/', function (req, res) {
    const reporter = req.body.reporter;
    const reporteduser = req.body.reporteduser;
    const platform = req.body.platform;
    const evidence = req.body.evidence;
    const discordtag = req.body.discordtag;

    let reportschannel = client.channels.cache.find(channel => channel.name === `${config.reportschannel}`);
    if (!reportschannel) return console.log(`A #${config.reportschannel} channel does not exist.`);

    var embed = new Discord.MessageEmbed()
      .setTitle('Incoming Web Report')
      .addField(`Reported Player`, reporter, true)
      .addField(`Reported By`, reporteduser, true)
      .addField(`Platform`, platform, true)
      .addField(`Evidence`, evidence)
      .setFooter(`Please contact the reporter ${reporter} at ${discordtag} for more information.`)
      .setColor('#99ddff')
    reportschannel.send(embed);
    res.render('errorviews/500', {
      "pagetitle": "500: Internal Server Error"
    });
    return;
  });

  return router;
};
