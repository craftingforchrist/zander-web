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
      if(req.session.user){
          res.locals.info = true;
      }
      else{
          res.locals.info = false;
      }
    res.render('feedback', {
      "pagetitle": "Feedback"
    });
  });

  router.post('/', function (req, res) {
    const username = req.body.username;
    const feedbacktype = req.body.feedbacktype;
    const detailfeedback = req.body.detailfeedback;

    try {
      if (config.discordsend == true) {
        //
        // Discord Notification Send
        // Requires a #enquiries channel to be created.
        //
        let enquirieschannel = client.channels.find(c => c.name === 'enquiries');
        if (!enquirieschannel) return console.log('A #feedback channel does not exist.');

        var embed = new Discord.RichEmbed()
          .setTitle(`Feedback`)
          .addField(`Username`, `${username}`, true)
          .addField(`What type of feedback would you like to provide?`, `${feedbacktype}`, true)
          .addField(`Please provide detail on your feedback.`, `${detailfeedback}`)
          .setColor('#79ff4d')
        enquirieschannel.send(embed);
        console.log(chalk.yellow('[CONSOLE] ') + chalk.blue('[DISCORD] ') + `Feedback has been sent.`);
      };

      if (config.mailsend == true) {
        //
        // Mail Send
        // Requires a email to be in the notificationemail field.
        //
        ejs.renderFile(path.join(__dirname + "../../views/email/feedback.ejs"), {
          subject: `[Feedback] ${username} // ${feedbacktype}`,
          username: username,
          feedbacktype: feedbacktype,
          detailfeedback: detailfeedback
        }, function (err, data) {
          if (err) {
              console.log(err);
          } else {
              var mainOptions = {
                  from: process.env.serviceauthuser,
                  to: config.notificationemail,
                  subject: `[Feedback] ${username} // ${feedbacktype}`,
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
