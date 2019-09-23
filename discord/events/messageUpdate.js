const Discord = require('discord.js');
const chalk = require('chalk');

module.exports = (message) => {
  if (message.author.bot) return;

  let adminlogchannel = message.guild.channels.find(c => c.name === 'admin-log');
  if (!adminlogchannel) return;

  let embed = new Discord.RichEmbed()
    .setTitle('Message Edited')
    .setDescription(`Message has been edited in #${message.channel.name} by ${message.author.username}: ${message.content}`)
    .setColor('#e69500')
  adminlogchannel.send(embed);

  console.log(chalk.yellow(`A message has been edited in #${message.channel.name} by ${message.author.username}: ${message.content}`));
  return
}
