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
    res.render('contact', {
      "servername": `${config.servername}`,
      "sitecolour": `${config.sitecolour}`,
      "email": `${config.email}`,
      "serverip": `${config.serverip}`,
      "website": `${config.website}`,
      "description": `${config.description}`,
      "weblogo": `${config.weblogo}`,
      "webfavicon": `${config.webfavicon}`,
      "pagetitle": "Contact"
    });
  });

  router.post('/', function (req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const enquirysubject = req.body.enquirysubject;
    const message = req.body.message;

    try {
      if (config.discordsend == true) {
        //
        // Discord Notification Send
        // Requires a #enquiries channel to be created.
        //
        let enquirieschannel = client.channels.find(c => c.name === 'enquiries');
        if (!enquirieschannel) return console.log('A #enquiries channel does not exist.');

        var embed = new Discord.RichEmbed()
          .setTitle(`New Contact Enquiry`)
          .addField(`Username/Name`, `${name}`, true)
          .addField(`Email`, `${email}`, true)
          .addField(`Subject`, `${enquirysubject}`)
          .addField(`Message`, `${message}`)
          .setColor('#86b300')
        enquirieschannel.send(embed);
        console.log(chalk.yellow('[CONSOLE] ') + chalk.blue('[DISCORD] ') + `Enquiry has been sent.`);
      };

      if (config.mailsend == true) {
        //
        // Mail Send
        // Requires a email to be in the notificationemail field.
        //
        ejs.renderFile(path.join(__dirname + "../../views/email/enquiry.ejs"), {
          subject: `[Enquiry] ${enquirysubject}`,
          name: req.body.name,
          email: req.body.email,
          enquirysubject: req.body.enquirysubject,
          message: req.body.message
        }, function (err, data) {
          if (err) {
              console.log(err);
          } else {
              var mainOptions = {
                  from: process.env.serviceauthuser,
                  to: config.notificationemail,
                  subject: `[Enquiry] ${enquirysubject}`,
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
