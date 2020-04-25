const Discord = require('discord.js');
const config = require('../../config.json')

module.exports.run = async (client, message, args) => {
  message.channel.createInvite().then((invite) => {
    let embed = new Discord.MessageEmbed()
      .setTitle('Network Servers')
      .setURL(`${config.website}play`)
      .setDescription(`A list of all of the Servers that our Network offers can be found on our website here: ${config.website}play`)
    message.channel.send(embed);
  });
};

module.exports.help = {
  name: 'ip'
};
