const Discord = require('discord.js');
const config = require('../../config.json')

module.exports.run = async (client, message, args) => {
  var embed = new Discord.MessageEmbed()
    .setTitle(`Ranks`)
    .setURL(`${config.website}ranks`)
    .setDescription(`You can see the perks of some of the ranks that we offer here. Visit the Shop to buy any of our ranks to support our Server and operations: ${config.website}ranks`)
  message.channel.send(embed);
};

module.exports.help = {
  name: 'ranks'
};
