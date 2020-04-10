const Discord = require('discord.js');
const config = require('../../config.json')

module.exports.run = async (client, message, args) => {
  var embed = new Discord.MessageEmbed()
    .setTitle(`Website`)
    .setURL(`${config.website}`)
    .setDescription(`You can our website here: ${config.website}`)
    .setColor('#ffa366')
  message.channel.send(embed);
};

module.exports.help = {
  name: 'website'
};
