const Discord = require('discord.js');
const config = require('../../../config.json');
const HexColour = require('../../../HexColour.json');
const database = require('../../../controllers/database.js'); // Database controller
const moment = require('moment');
moment().format();

module.exports.run = async (client, message, args) => {
  const auditUsername = args[0];
  const auditDiscordID = args[1];
  const auditDiscordUser = client.users.cache.get(auditDiscordID);
  const auditDiscordUserLastMessage = auditDiscordUser.lastMessage;

  console.log(auditDiscordUser);

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
  let sql = `select playerdata.username, (select server from gamesessions where playerid = (select id from playerdata where username=?) order by sessionend asc limit 1) as 'server', (select sessionend from gamesessions where playerid = (select id from playerdata where username=?) order by sessionend asc limit 1) as 'lastlogintime', TIME_TO_SEC(timediff(NOW(), lp.lp_timestamp)) as 'lastplayed' from (select gamesessions.playerid, max(if(gamesessions.sessionend, gamesessions.sessionend, NOW())) as 'lp_timestamp' from gamesessions group by gamesessions.playerid) as lp left join playerdata on playerdata.id = lp.playerid where username=?;`;
  database.query (sql, [auditUsername, auditUsername, auditUsername], function (err, auditResults) {
    if (err) {
      throw err;
    } else {
      if (!auditResults.length) {
        let embed = new Discord.MessageEmbed()
           .setTitle('Error!')
           .setColor(HexColour.red)
           .setDescription('This user does not exist.')
        message.channel.send(embed).then(msg => msg.delete({ timeout: 3000 }));
        return;
      };

      let embed = new Discord.MessageEmbed()
          .setTitle(`${auditResults[0].username}'s Audit Profile`)
          .setColor(HexColour.purple)
          .addField("Last Logged in", `${moment(auditResults[0].lastlogintime).fromNow()} on ${auditResults[0].server}`)
          .addField("Last Discord Message sent", "Message: `" + auditDiscordUserLastMessage.content + "`\nChannel: `" + auditDiscordUserLastMessage.channel.name + "`\nDate & Time: " + moment(auditDiscordUserLastMessage.createdTimestamp).calendar())

          message.channel.send(embed);
      return;
    }
  });
};

module.exports.help = {
  name: 'audit',
  description: 'Check the in-game and Discord activity of a user.',
  usage: 'audit [username] [discord id]'
};
