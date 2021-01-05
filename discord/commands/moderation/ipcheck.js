const Discord = require('discord.js');
const config = require('../../../config.json');
const HexColour = require('../../../HexColour.json');
const database = require('../../../controllers/database.js'); // Database controller
const moment = require('moment');
moment().format();

module.exports.run = async (client, message, args) => {
  const user = message.guild.member(message.author); // Get the command user.
  const roles = user.roles.cache; // Get the users roles.
  const userRolesArr = [];
  // Put all roles into an array.
  roles.forEach(function (data) {
    userRolesArr.push(data.name);
  });

  // Check if the user has role access to this command.
  if (userRolesArr.some(role => config.administrationroles.includes(role))) {
    // console.log("You have access.");
  } else {
    let embed = new Discord.MessageEmbed()
      .setTitle('Error!')
      .setColor('#ff6666')
      .setDescription('You do not have permission to execute this command.')
    message.channel.send(embed).then(msg => msg.delete({ timeout: 3000 }));
    return;
  };

  const channel = message.channel.name;
  // Check if the user has sent command in allowed channel.
  if (config.administrationcommandchannels.includes(channel)) {
    // console.log("You have access to this channel.");
  } else {
    let embed = new Discord.MessageEmbed()
      .setTitle('Error!')
      .setColor('#ff6666')
      .setDescription('You can not execute this command here.')
    message.channel.send(embed).then(msg => msg.delete({ timeout: 3000 }));
    return;
  };

  //
  // Database Entry
  //
  let sql = `SELECT 1 FROM playerdata WHERE username=?;`;
  database.query (sql, [args[0]], function (err, results) {
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

      let sql = `select max(gs.sessionstart) as 'lastlogin', pd.username as 'username', gs.ipaddress as 'ipaddress' from gamesessions gs, playerdata pd where gs.playerid = pd.id and gs.ipaddress in (select distinct gs1.ipaddress from gamesessions gs1, playerdata pd1 where pd1.id = gs1.playerid and pd1.username like ?) group by pd.username, gs.ipaddress order by max(gs.sessionstart) asc;`;
      database.query (sql, [args[0]], function (err, results) {
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
  });
};

module.exports.help = {
  name: 'ipcheck',
  description: 'Checks the accounts connected to the players name.',
  usage: 'ipcheck [username]'
};
