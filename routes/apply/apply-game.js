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
const game = require('../../functions/apply/game');

module.exports = (client) => {
  router.get('/', (req, res, next) => {
    if (config.gameserverapp == false) {
      res.redirect("/apply");
    } else {
      res.render('apply/apply-game', {
        "pagetitle": "Apply - Game"
      });
    };
  });

  router.post('/', function (req, res) {
    const username = req.body.username;
    const discordtag = req.body.discordtag;
    const email = req.body.email;
    const howdidyouhearaboutus = req.body.howdidyouhearaboutus;
    const additionalinformation = req.body.additionalinformation;

    game.applycheck(username, res);
    game.applygamedbinsert(username, email, discordtag, howdidyouhearaboutus, additionalinformation);

    try {
      if (config.discordsend == true) {
        //
        // Discord Notification Send
        //
        let applicationschannel = client.channels.find(c => c.name === `${config.applicationschannel}`);
        if (!applicationschannel) return console.log(`A #${config.applicationschannel} channel does not exist.`);

        var embed = new Discord.RichEmbed()
          .setTitle(`Whitelist Application [${username}]`)
          .addField(`Username`, `${username}`, true)
          .addField(`Email`, `${email}`, true)
          .addField(`Discord Tag`, `${discordtag}`, true)
          .addField(`How did you hear about us`, `${howdidyouhearaboutus}`)
          .addField(`Any additional information`, `${additionalinformation}`)
          .setColor('#99ddff')
        applicationschannel.send(embed);

        console.log(chalk.yellow('[CONSOLE] ') + chalk.blue('[DISCORD] ') + `Whitelist Application for ${username} has been sent.`);
      };

      if (config.mailsend == true) {
        //
        // Mail Send
        // Requires a email to be in the notificationemail field.
        //
        ejs.renderFile(path.join(__dirname + "../../../views/email/apply/apply-game.ejs"), {
          subject: `[Game Application] ${username}`,
          username: username,
          email: email,
          discordtag: discordtag,
          howdidyouhearaboutus: howdidyouhearaboutus,
          additionalinformation: additionalinformation
        }, function (err, data) {
          if (err) {
              console.log(err);
          } else {
              var mainOptions = {
                  from: process.env.serviceauthuser,
                  to: config.notificationemail,
                  subject: `[Game Application] ${username}`,
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
      };
    } catch (error) {
      console.log('An error occured');
      console.log(error);
    }
    res.redirect('/');
  });

  return router;
};
