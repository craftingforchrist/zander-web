const express = require('express');
const router = express.Router();
const config = require('../config.json');
const Discord = require('discord.js');
const client = new Discord.Client({ disableEveryone: true });
const chalk = require('chalk');
const ejs = require('ejs');
const path = require('path');
const transporter = require('../controllers/mail.js');

module.exports = (client) => {
  router.get('/', (req, res, next) => {
    res.render('report', {
      "pagetitle": "Report a Player"
    });
  });

  router.post('/', function (req, res) {
    const reporter = req.body.reporter;
    const reporteduser = req.body.reporteduser;
    const platform = req.body.platform;
    const evidence = req.body.evidence;
    const discordtag = req.body.discordtag;

    try {
      if (config.discordsend == true) {
        //
        // Discord Notification Send
        // Requires a #reports channel to be created.
        //
        let reportsschannel = client.channels.find(c => c.name === 'reports');
        if (!reportsschannel) return console.log('A #reports channel does not exist.');

        var embed = new Discord.RichEmbed()
          .setTitle(`Player Report [${reporteduser}]`)
          .addField(`What is your Minecraft Username?`, `${reporter}`, true)
          .addField(`What is the Minecraft username of the player you would like to report?`, `${reporteduser}`, true)
          .addField(`Platform`, `${platform}`, true)
          .addField(`Please provide your reasoning for this report with evidence.`, `${evidence}`)
          .addField(`What is your Discord Tag?`, `${discordtag}`)
          .setColor('#ff8533')
        reportsschannel.send(embed);
        console.log(chalk.yellow('[CONSOLE] ') + chalk.blue('[DISCORD] ') + `Player Report for ${reporteduser} has been sent.`);
      };

      if (config.mailsend == true) {
        //
        // Mail Send
        // Requires a email to be in the notificationemail field.
        //
        ejs.renderFile(path.join(__dirname + "../../views/email/report.ejs"), {
          subject: `[Player Report] ${reporteduser}`,
          reporteduser: reporteduser,
          reporter: reporter,
          platform: platform,
          evidence: evidence,
          discordtag: discordtag
        }, function (err, data) {
          if (err) {
              console.log(err);
          } else {
              var mainOptions = {
                  from: process.env.serviceauthuser,
                  to: config.notificationemail,
                  subject: `[Player Report] ${reporteduser}`,
                  html: data
              };

              transporter.sendMail(mainOptions, function (err, info) {
                  if (err) {
                      console.log(err);
                  } else {
                      console.log('Message sent: ' + info.response);
                  }
              });
          }
        });
      }

      res.redirect('/');
    } catch (error) {
      console.log('An error occured');
      console.log(error);
    }
  });

  return router;
};
