const Discord = require('discord.js');
const ejs = require('ejs');
const path = require('path');
const config = require('../../config.json');
const transporter = require('../../controllers/mail.js');
const client = new Discord.Client({ disableEveryone: true });

module.exports = async (reaction, user) => {
  // let channel = reaction.message.channel.name;
  // let message = reaction.message, emoji = reaction.emoji;
  //
  // if (user.bot == true) return; // This stops the bot from picking up it's own reactions.
  // if (!channel === process.applicationschannel) return; // This allows the bot to only detect changes in the #applications channel
  //
  // if (emoji.name == '✅') {
  //   let usersname = reaction.message.embeds[0].fields[0].value;
  //   let email = reaction.message.embeds[0].fields[1].value;
  //
  //   //
  //   // Mail Send
  //   // Requires a email to be in the notificationemail field.
  //   //
  //   ejs.renderFile(path.join(__dirname + "../../../views/email/apply/apply-accept.ejs"), {
  //     subject: `Welcome to the Server!`,
  //     username: "shadowolfyt",
  //     serverip: config.serverip,
  //     contactemail: config.contactemail
  //   }, function (err, data) {
  //     if (err) {
  //         console.log(err);
  //     } else {
  //         var mainOptions = {
  //             from: process.env.serviceauthuser,
  //             to: config.notificationemail,
  //             subject: `🙌 Welcome, we're glad to have you.`,
  //             html: data
  //         };
  //
  //         transporter.sendMail(mainOptions, function (err, info) {
  //             if (err) {
  //                 console.log(err);
  //             } else {
  //                 console.log('Message sent: ' + info.response);
  //             }
  //         });
  //     }
  //   });
  //
  //   message.delete();
  //   return;
  // } else if (emoji.name == '❎') {
  //   message.delete();
  //   return;
  // };
};
