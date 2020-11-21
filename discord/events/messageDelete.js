const Discord = require('discord.js');
const config = require('../../config.json')
const HexColour = require('../../HexColour.json')

module.exports = async message => {
  if (!message.guild) return;
  if (message.author.bot) return;
	const fetchedLogs = await message.guild.fetchAuditLogs({
		limit: 1,
		type: 'MESSAGE_DELETE',
	});
  const deletionLog = fetchedLogs.entries.first();
  if (!deletionLog) return console.log(`[CONSOLE] A message by ${message.author.tag} was deleted, but no relevant audit logs were found.`);

  const { executor, target } = deletionLog;
  let adminlogchannel = message.guild.channels.cache.find(c => c.name === config.punishmentchannel);
  if (!adminlogchannel) return;

  if (target.id === message.author.id) {
    let embed = new Discord.MessageEmbed()
      .setTitle('Message Deleted')
      .setDescription(`${message.content}`)
      .setColor(HexColour.yellow)
      .setFooter(`Message Author: ${message.author.username}\nDeleted Channel: #${message.channel.name}\nDeleted By: ${executor.username}`)
    adminlogchannel.send(embed);
	}	else {
    let embed = new Discord.MessageEmbed()
      .setTitle('Message Deleted')
      .setDescription(`${message.content}`)
      .setColor(HexColour.yellow)
      .setFooter(`Message Author: ${message.author.username}\nDeleted Channel: #${message.channel.name}\nDeleted By: ${message.author.username}`)
    adminlogchannel.send(embed);
	}
  return
};
