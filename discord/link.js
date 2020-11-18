// const Discord = require('discord.js');
// const config = require('../../config.json');
// const HexColour = require('../../HexColour.json');
// const database = require('../../controllers/database.js');
// const randomToken = require('random-token').create('abcdefghijklmnopqrstuvwxzyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
// const token = randomToken(32);
//
// module.exports.run = async (client, message, args) => {
//   if (!args[0]) {
//     let embed = new Discord.MessageEmbed()
//       .setTitle('Error!')
//       .setColor(HexColour.red)
//       .setDescription(`You must provide a valid Minecraft Username.\nIf you are a Bedrock user, put a * at the front of your username.`)
//     message.channel.send(embed);
//     return;
//   } else {
//
//     database.query (`select username from playerdata where username="${args[0]}";`, function (err, results) {
//       if (err) {
//         throw err;
//       } else {
//         if (!results[0]) {
//           let embed = new Discord.MessageEmbed()
//             .setTitle('Error!')
//             .setColor(HexColour.red)
//             .setDescription(`That player could not be found in our database.\nPlease ensure that you have joined our Network (${config.serverip})`)
//           message.channel.send(embed);
//         } else {
//           // Check if the player has already started registration.
//           database.query (`select * from playerregistration where player_id = (select id from playerdata where username = ?);`, [`${args[0]}`], function (err, results) {
//             if (err) {
//               throw err;
//             } else {
//               if (results.length > 0) {
//                 console.log(results);
//
//                 // Send a message that this account is already linked or the link process has already started.
//                 var embed = new Discord.MessageEmbed()
//                   .setTitle(`Account is already linked!`)
//                   .setColor(HexColour.orange)
//                   .setDescription(`This account is already linked or the link process has already started, check your direct messages for the link code.`)
//                 message.channel.send(embed);
//                 return;
//               } else {
//                 // Registration confirmation message sends to the channel that the user executes the command in.
//                 var embed = new Discord.MessageEmbed()
//                   .setTitle(`Registration Message Sent!`)
//                   .setColor(HexColour.blue)
//                   .setDescription(`${message.author.username} I have sent you a private message with instructions on how to link your account.`)
//                 message.channel.send(embed);
//
//                 // Start the registration linking process and put token into table.
//                 database.query (`insert into playerregistration (player_id, registrationtoken) values ((select id from playerdata where username = ?), ?);`, [`${args[0]}`, `${token}`], function (err, results) {
//                   if (err) {
//                     throw err;
//                   } else {
//                     // Registration direct message is sent to the user with their link code.
//                     var registrationtokenembed = new Discord.MessageEmbed()
//                       .setTitle(`Account Linking Instructions`)
//                       .setDescription(`To link your Discord account with your Minecraft account you need to open Minecraft and type \`/linkcode ${token}\`\nOnce this is complete, you should be successfully linked.`)
//                     message.author.send(registrationtokenembed);
//                   }
//                 });
//                 return;
//               }
//             }
//           });
//         }
//       }
//     });
//     return;
//   }
// };
//
// module.exports.help = {
//   name: 'link'
// };
