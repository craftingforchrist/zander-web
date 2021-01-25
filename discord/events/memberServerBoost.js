const Discord = require('discord.js');
const config = require('../../config.json')

module.exports = async (oldMember, newMember) => {
  const oldRole = oldMember.roles.cache.find(role => role.name === 'Nitro Booster');
  const newRole = newMember.roles.cache.find(role => role.name === 'Nitro Booster');

  if (!newMember.guild) return;
  // if (member.author.bot) return;

  let welcomechannel = newMember.guild.channels.cache.find(c => c.name === config.welcomechannel);
  if (!welcomechannel) return;

  if (!oldRole && newRole) {
    let embed = new Discord.MessageEmbed()
      .setTitle(`${newMember.user.username} has boosted the Server!  :tada:`)
      .setColor(`#f47fff`)
    welcomechannel.send(embed);
  } 
  return;
};
