const Discord = require('discord.js');
const HexColour = require('../../HexColour.json')

module.exports = async (oldMessage, newMessage) => {
  if (oldMessage.author.bot) return;
  if (oldMessage.content == newMessage.content) return;

  let adminlogchannel = oldMessage.guild.channels.cache.find(c => c.name === 'admin-log');
  if (!adminlogchannel) return;

  let embed = new Discord.MessageEmbed()
    .setTitle('Message Edited')
    .setDescription(`*Original Message*\n${oldMessage.content}\n\n*Edited Message*\n${newMessage.content}`)
    .setColor(HexColour.yellow)
    .setFooter(`Message Author: ${oldMessage.author.username}\nEdited Channel: #${oldMessage.channel.name}`)
  adminlogchannel.send(embed);

  console.log(`A message has been edited in #${oldMessage.channel.name} by ${oldMessage.author.username}: ${oldMessage.content}`);
  return
};
