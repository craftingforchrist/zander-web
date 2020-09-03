const Discord = require('discord.js');
const config = require('../../../config.json');
const hexcolour = require('../../../hexcolour.json');
const database = require('../../../controllers/database'); // Database controller
const lpdatabase = require('../../../controllers/lpdatabase'); // LP Database controller
const MojangAPI = require('mojang-api');

module.exports.run = async (client, message, args) => {
  // Checks if the user has permissions to run the command.
  if (!message.member.hasPermission(`${module.exports.help.permission}`)) {
    let embed = new Discord.MessageEmbed()
      .setTitle('Error!')
      .setColor(hexcolour.red)
      .setDescription('You do not have the suffient permissions to run this command.')
    message.channel.send(embed);
    return;
  }

  if (!args[0]) {
    let embed = new Discord.MessageEmbed()
      .setTitle('Error!')
      .setColor(hexcolour.yellow)
      .setDescription('lp promote [user] [role]\nlp demote [user] [role]\nlp ranks [user]')
    message.channel.send(embed);
  }

  switch (args[0]) {
    case 'promote':
      if (!args[1]) {
        let embed = new Discord.MessageEmbed()
          .setTitle('Error!')
          .setColor(hexcolour.yellow)
          .setDescription('Need to specify the UUID of the player you would like to promote.')
        message.channel.send(embed);
      }






      break;
    case 'demote':
      // code block
      message.channel.send('This will demote a user.');

      if (!args[1]) {

      }




      break;
    case 'ranks':
      // code block
      if (!args[1]) {
        let embed = new Discord.MessageEmbed()
          .setTitle('Error!')
          .setColor(hexcolour.red)
          .setDescription('The UUID that you have entered does not exist, please try again.')
        message.channel.send(embed);
        return;
      }

      // lpdatabase.query (`select permission from luckperms_user_permissions where uuid="${args[1]}";`, function (err, results) {
      //   if (err) {
      //     throw err;
      //   } else {
      //     var embed = new Discord.MessageEmbed()
      //       .setTitle(`Ranks for ${args[1]}`)
      //       .setColor(hexcolour.blue)
      //       for (var i = 0; i < results.length; i++) {
      //         let permission = results[i].permission
      //         // console.log(results[i].permission);
      //         .addField('Rank', permission)
      //       }
      //
      //     message.channel.send(embed);
      //   }
      // });
      break;

    default:
      // code block
  }

  return;
};

module.exports.help = {
  name: 'lp',
  description: 'Promote and demote users.',
  permission: 'ADMINISTRATOR',
  usage: 'lp [promote/demote/ranks] player'
};
