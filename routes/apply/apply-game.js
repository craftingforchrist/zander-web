const express = require('express');
const router = express.Router();
const config = require('../../config.json');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = (client) => {
  router.get('/', (req, res, next) => {
    res.render('apply/apply-game', {
      "servername": `${config.servername}`,
      "sitecolour": `${config.sitecolour}`,
      "email": `${config.email}`,
      "serverip": `${config.serverip}`,
      "website": `${config.website}`,
      "description": `${config.description}`,
      "weblogo": `${config.weblogo}`,
      "webfavicon": `${config.webfavicon}`,
      "pagetitle": "Apply - Game",
      termsmd: config.termsmd,
      privacymd: config.privacymd,
      rulesmd: config.rulesmd
    });
  });

  router.post('/apply-game', function (req, res) {
    try {
      if (config.discordsend == true) {
        //
        // Discord Notification Send
        // Requires a #whitelist-apps channel to be created.
        //
        let applicationschannel = client.channels.find(c => c.name === 'applications');
        if (!applicationschannel) return console.log('A #applications channel does not exist.');

        var embed = new Discord.RichEmbed()
          .setTitle(`Whitelist Application [${req.body.minecraftUsernameselector}]`)
          .addField(`Username`, `${req.body.minecraftUsernameselector}`, true)
          .addField(`Discord Tag`, `${req.body.discordtagselector}`, true)
          .addField(`How did you hear about us`, `${req.body.howdidyouhearaboutusselector}`)
          .addField(`Any additional information`, `${req.body.additionalinformationselector}`)
          .setColor('#99ddff')
        applicationschannel.send(embed);
        console.log(chalk.yellow('[CONSOLE] ') + chalk.blue('[DISCORD] ') + `Whitelist Application for ${req.body.minecraftUsernameselector} has been sent.`);
      };

      if (config.mailsend == true) {
        //
        // Mail Send
        // Requires a email to be in the notificationemail field.
        //
        ejs.renderFile(__dirname + "/views/email/apply/apply-game.ejs", {
          subject: `[Game Application] ${req.body.minecraftUsernameselector}`,
          username: req.body.minecraftUsernameselector,
          discordtag: req.body.discordtagselector,
          howdidyouhearaboutus: req.body.howdidyouhearaboutusselector,
          additionalinformation: req.body.additionalinformationselector
        }, function (err, data) {
          if (err) {
              console.log(err);
          } else {
              var mainOptions = {
                  from: process.env.serviceauthuser,
                  to: config.notificationemail,
                  subject: `[Game Application] ${req.body.minecraftUsernameselector}`,
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
