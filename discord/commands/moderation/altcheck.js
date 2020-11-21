const Discord = require('discord.js');
const config = require('../../../config.json');
const HexColour = require('../../../HexColour.json');
const database = require('../../../controllers/database.js'); // Database controller
const moment = require('moment');
moment().format();

module.exports.run = async (client, message, args) => {
  if (message.channel.name != config.altcheckchannel) {
    let embed = new Discord.MessageEmbed()
      .setTitle('Error!')
      .setColor('#ff6666')
      .setDescription('You can not execute this command here.')
    message.channel.send(embed);
    return;
  } else {
    // Checks if the user has permissions to run the command.
    if (!message.member.hasPermission(`${module.exports.help.permission}`)) {
      let embed = new Discord.MessageEmbed()
        .setTitle('Error!')
        .setColor(HexColour.red)
        .setDescription('You do not have permissions to run this command.')
      message.channel.send(embed).then(msg => msg.delete({ timeout: 3000 }));
      return;
    } else {
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

          let sql = `select max(gs.sessionstart) as 'lastlogin', pd.username as 'username', gs.ipaddress as 'ipaddress' from gamesessions gs, playerdata pd where gs.playerid = pd.id and gs.ipaddress in (select distinct gs1.ipaddress from gamesessions gs1, playerdata pd1 where pd1.id = gs1.playerid and pd1.username like '${args[0]}') group by pd.username, gs.ipaddress order by max(gs.sessionstart) asc;`;
          database.query (sql, function (err, results) {
            if (err) {
              throw err;
            } else {
              let embed = new Discord.MessageEmbed()
              .setTitle(`${args[0]}'s Connected Accounts`)
              .setColor(HexColour.lightblue)

              results.forEach(function(playeripdata) {
                embed.addField(`${playeripdata.username}`, `Last Login: ${moment(playeripdata.lastlogin).format("LLLL")}`)
              })
              message.channel.send(embed);
            }
          });
        }
      });
    };
  };
};

module.exports.help = {
  name: 'altcheck',
  description: 'Checks the accounts connected to the players name.',
  permission: 'MANAGE_MESSAGES',
  usage: 'altcheck [username]'
};
