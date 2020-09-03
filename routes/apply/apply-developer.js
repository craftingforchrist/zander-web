const express = require('express');
const router = express.Router();
const config = require('../../config.json');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const Discord = require('discord.js');
const client = new Discord.Client({ disableEveryone: true });
client.commands = new Discord.Collection();
const ejs = require('ejs');
const path = require('path');
const transporter = require('../../controllers/mail.js');

module.exports = (client) => {
  router.get('/', (req, res, next) => {
    if (config.developerapp == false) {
      res.redirect("/apply");
    } else {
      res.redirect(`${config.developerapplink}`);
      // res.render('apply/apply-developer', {
      //   "pagetitle": "Apply - Developer"
      // });
    };
  });

  // router.post('/', function (req, res) {
  //   const name = req.body.name;
  //   const email = req.body.email;
  //   const discordtag = req.body.discordtag;
  //   const devexperience = req.body.devexperience;
  //   const devcontribute = req.body.devcontribute;
  //   const interest = req.body.interest;
  //   const bestchoice = req.body.bestchoice;
  //   const additionalinformation = req.body.additionalinformation;
  //
  //   try {
  //     if (config.discordsend == true) {
  //       //
  //       // Discord Notification Send
  //       // Requires a #applications channel to be created.
  //       //
  //       let applicationsschannel = client.channels.find(c => c.name === 'applications');
  //       if (!applicationsschannel) return console.log('A #applications channel does not exist.');
  //
  //       var embed = new Discord.RichEmbed()
  //         .setTitle(`Developer Application [${name}]`)
  //         .addField(`Name`, `${name}`, true)
  //         .addField(`What is your email address?`, `${email}`, true)
  //         .addField(`What is your Discord Tag?`, `${discordtag}`, true)
  //         .addField(`What experience do you have as a Developer?`, `${devexperience}`)
  //         .addField(`Provide links to projects that you have contributed to.`, `${devcontribute}`)
  //         .addField(`Why are you interested in joining our team?`, `${interest}`)
  //         .addField(`Why do you think you are the best choice for our team?`, `${bestchoice}`)
  //         .addField(`Any other information or comments?`, `${additionalinformation}`)
  //         .setColor('#d580ff')
  //       applicationsschannel.send(embed);
  //       console.log(chalk.yellow('[CONSOLE] ') + chalk.blue('[DISCORD] ') + `Developer Application for ${name} has been sent.`);
  //     };
  //
  //     if (config.mailsend == true) {
  //       //
  //       // Mail Send
  //       // Requires a email to be in the notificationemail field.
  //       //
  //       ejs.renderFile(path.join(__dirname + "../../../views/email/apply/apply-developer.ejs"), {
  //         subject: `[Developer] ${name}`,
  //         name: name,
  //         email: email,
  //         discordtag: discordtag,
  //         devexperience: devexperience,
  //         devcontribute: devcontribute,
  //         interest: interest,
  //         bestchoice: bestchoice,
  //         additionalinformation: additionalinformation
  //       }, function (err, data) {
  //         if (err) {
  //             console.log(err);
  //         } else {
  //             var mainOptions = {
  //                 from: process.env.serviceauthuser,
  //                 to: config.notificationemail,
  //                 subject: `[Developer] ${name}`,
  //                 html: data
  //             };
  //
  //             transporter.sendMail(mainOptions, function (err, info) {
  //                 if (err) {
  //                     console.log(err);
  //                 } else {
  //                     console.log('Message sent: ' + info.response);
  //                 }
  //             });
  //         }
  //       });
  //     }
  //
  //     res.render('apply/apply', {
  //       "pagetitle": "Apply",
  //       successalert: true,
  //       erroralert: null,
  //       message: "Success! Your application has been submitted and will be reviewed by our Developers! You will be contacted by either Discord or Email.",
  //       errors: req.flash('error'),
  //       developerapp: config.developerapp,
  //       contentcreatorapp: config.contentcreatorapp,
  //       gameserverapp: config.gameserverapp,
  //       juniorstaffapp: config.juniorstaffapp,
  //       socialmediaapp: config.socialmediaapp
  //     });
  //   } catch (error) {
  //     console.log('An error occured');
  //     console.log(error);
  //   }
  // });

  return router;
};
