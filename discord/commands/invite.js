const Discord = require('discord.js');
const config = require('../../config.json')

module.exports.run = async (client, message, args) => {
  message.channel.createInvite().then((invite) => {
    let embed = new Discord.MessageEmbed()
      .setTitle('Invite Created!')
      .setURL(`https://discord.gg/${invite.code}`)
      .setDescription(`Successfully created an invite!\nhttps://discord.gg/${invite.code}`)
    message.channel.send(embed);

    console.log(`[CONSOLE] [DISCORD] ${message.author.username} has generated an invite: https://discord.gg/${invite.code}`);
  });
};

module.exports.help = {
  name: 'invite'
};
