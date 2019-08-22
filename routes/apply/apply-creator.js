const express = require('express');
const router = express.Router();
const config = require('../../config.json');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const Discord = require('discord.js');
const client = new Discord.Client({ disableEveryone: true });
const chalk = require('chalk');
const ejs = require('ejs');
const path = require('path');
const transporter = require('../../controllers/mail.js');

module.exports = (client) => {
  router.get('/', (req, res, next) => {
    res.render('apply/apply-creator', {
      "pagetitle": "Apply - Content Creator"
    });
  });

  router.post('/', function (req, res) {
    const username = req.body.minecraftusername;
    const discordtag = req.body.discordtagselector;
    const platform = req.body.contentplatform;
    const otherplatform = req.body.othercontentplatform;
    const channellink = req.body.channellink;
    const subscribercount = req.body.subscribercount;
    const additionalinformation = req.body.additionalinformation;

    try {
      switch (platform) {
        case "YouTube":
          console.log('This user has requested YouTube.');
          break;

        case "Twitch":
          console.log('This user has requested Twitch.');
          break;

        case "Mixer":
          console.log('This user has requested Mixer.');
          break;

        case "Other":
          console.log('This user has requested Other, no data to pull, dropping request.');
          break;
      }

      if (config.discordsend == true) {
        //
        // Discord Notification Send
        // Requires a #applications channel to be created.
        //
        let applicationsschannel = client.channels.find(c => c.name === 'applications');
        if (!applicationsschannel) return console.log('A #applications channel does not exist.');

        var embed = new Discord.RichEmbed()
          .setTitle(`Content Creator Application [${username}]`)
          .addField(`Username`, `${username}`, true)
          .addField(`Discord Tag`, `${discordtag}`, true)
          .addField(`Content Platform`, `${platform}`)
          .addField(`Other Content Platform`, `${otherplatform}`)
          .addField(`Channel Link`, `${channellink}`)
          .addField(`Subscriber Count`, `${subscribercount}`)
          .addField(`Any additional information`, `${additionalinformation}`)
          .setColor('#00ace6')
        applicationsschannel.send(embed);
        console.log(chalk.yellow('[CONSOLE] ') + chalk.blue('[DISCORD] ') + `Content Creator Application for ${username} has been sent.`);
      };

      if (config.mailsend == true) {
        //
        // Mail Send
        // Requires a email to be in the notificationemail field.
        //
        ejs.renderFile(path.join(__dirname + "../../../views/email/apply/apply-creator.ejs"), {
          subject: `[Content Creator] ${username}`,
          username: username,
          discordtag: discordtag,
          platform: platform,
          otherplatform: otherplatform,
          channellink: channellink,
          subscribercount: subscribercount,
          additionalinformation: additionalinformation
        }, function (err, data) {
          if (err) {
              console.log(err);
          } else {
              var mainOptions = {
                  from: process.env.serviceauthuser,
                  to: config.notificationemail,
                  subject: `[Content Creator] ${username}`,
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
