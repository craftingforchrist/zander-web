const Discord = require('discord.js');
const chalk = require('chalk');

module.exports = (message) => {
  let adminlogchannel = message.guild.channels.find(c => c.name === 'admin-log');
  if (!adminlogchannel) return;

  let embed = new Discord.RichEmbed()
    .setTitle('Message Deleted')
    .setDescription(`Message has been deleted in #${message.channel.name} by ${message.author.username}: ${message.content}`)
    .setColor('#FFA500')
  adminlogchannel.send(embed);

  console.log(chalk.yellow(`A message has been deleted in #${message.channel.name} by ${message.author.username}: ${message.content}`));
  return
}
