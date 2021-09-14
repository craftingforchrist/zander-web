const Discord = require('discord.js');
const config = require('../../config.json')
const joinmessages = require('../../joinmessages.json');

module.exports = async (oldMember, newMember) => {
  if (!newMember.guild) return;
  // if (member.author.bot) return;

  const oldRole = oldMember.roles.cache.find(role => role.name === 'Verified');
  const newRole = newMember.roles.cache.find(role => role.name === 'Verified');

  let welcomechannel = newMember.guild.channels.cache.find(c => c.name === config.welcomechannel);
  if (!welcomechannel) return;

  // Grab random letters and numbers to get a HEX Colour.
  const randomColor = Math.floor(Math.random()*16777215).toString(16);

  // Select a random join message from joinmessages.json
  const randomJoinMessage = joinmessages[Math.floor(Math.random() * joinmessages.length)];

  if (!oldRole && newRole) {
    let embed = new Discord.MessageEmbed()
    .setTitle(randomJoinMessage.replace("%USERNAME%", newMember.user.username))
    .setColor(`#${randomColor}`)
    welcomechannel.send(embed);
  } 
  return;
};
