const Discord = require('discord.js');
const config = require('../../../config.json');
const HexColour = require('../../../HexColour.json');
const database = require('../../../controllers/database.js'); // Database controller
const moment = require('moment');
moment().format();

module.exports.run = async (client, message, args) => {
  if (message.channel.name != config.ipcheckchannel) {
    let embed = new Discord.MessageEmbed()
      .setTitle('Error!')
      .setColor(HexColour.red)
      .setDescription('You can not execute this command here.')
    message.channel.send(embed);
    return;
  } else {
    // Checks if the user has permissions to run the command.
    if (!message.member.hasPermission(`${module.exports.help.permission}`)) {
      let embed = new Discord.MessageEmbed()
        .setTitle('Error!')
        .setColor('#ff6666')
        .setDescription('You do not have permissions to run this command.')
      message.channel.send(embed);
      return;
    }

  if (message.channel.name == config.altcheckchannel) {
    //
    // Database Entry
    //
    let sql = `SELECT 1 FROM playerdata WHERE username = '${args[0]}';`;
    database.query (sql, function (err, results) {
      if (err) {
        throw err;
      } else {
        if (!results.length) {
          let embed = new Discord.MessageEmbed()
             .setTitle('Error!')
             .setColor(HexColour.red)
             .setDescription('This user does not exist.')
          message.channel.send(embed).then(msg => msg.delete({ timeout: 3000 }));
          return;
        }

        let sql = `select max(gs.sessionstart) as 'lastlogin', pd.username as 'username', gs.ipaddress as 'ipaddress' from gamesessions gs, playerdata pd where gs.player_id = pd.id and gs.ipaddress in (select distinct gs1.ipaddress from gamesessions gs1, playerdata pd1 where pd1.id = gs1.player_id and pd1.username like '${args[0]}') group by pd.username, gs.ipaddress order by max(gs.sessionstart) asc;`;
        database.query (sql, function (err, results) {
          if (err) {
            throw err;
          } else {
            let embed = new Discord.MessageEmbed()
            .setTitle(`${args[0]}'s Connected Accounts & IPs`)
            .setColor(HexColour.orange)
            .setFooter('This contains sensitive information, DO NOT send this to anyone.')

            results.forEach(function(playeripdata) {
              embed.addField(`${playeripdata.username}`, `Last Login: ${moment(playeripdata.lastlogin).format("LLLL")}\nIP Address: ${playeripdata.ipaddress}`)
            })
            message.channel.send(embed);
          }
        });
      }
    })
  } else {
    let embed = new Discord.MessageEmbed()
      .setTitle('Error!')
      .setColor(HexColour.red)
      .setDescription('You cannot execute this command here.')
    message.channel.send(embed).then(msg => msg.delete({ timeout: 3000 }));
    return;
  }
  }
};

module.exports.help = {
  name: 'ipcheck',
  description: 'Checks the accounts connected to the players name.',
  permission: 'ADMINISTRATOR',
  usage: 'ipcheck [username]'
};
