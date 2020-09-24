const {Client, MessageEmbed} = require('discord.js');

module.exports.run = async (client, message, args) => {
  const staff = [];
  message.guild.members.cache.forEach(member => {
    const roles = member.roles.cache.map(role => role.name.toLowerCase());
    if (!(member.presence.status === 'online' || member.presence.status === 'dnd' || member.presence.status === 'idle')) return; // This is to ensure that only people online, dnd and idle are pinged.
    if (roles.includes('administrator') || roles.includes('senior staff') || roles.includes('staff') || roles.includes('junior staff')) {
      staff.push(member);
    };
  });

  if (staff.length < 1) {
    let embed = new MessageEmbed();
    embed.setTitle(`An error occurred.`);
    embed.setColor('RED');
    embed.setDescription('No staff are currently online right now.');
    message.channel.send(embed);
  };

  message.channel.send(`Notifying Online Staff:\n${staff.map(staffmember => staffmember.toString()).join(', ')}`);
};

module.exports.help = {
  name: "staff",
  description: "Alert all staff members currently online.",
  usage: "staff"
};
