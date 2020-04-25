const Discord = require('discord.js');
const config = require('../../config.json')

module.exports.run = async (client, message, args) => {
  var embed = new Discord.MessageEmbed()
    .setTitle(`Server Rules`)
    .setURL(`${config.website}rules`)
    .setDescription(`You can see the server rules here: ${config.website}rules`)
  message.channel.send(embed);
};

module.exports.help = {
  name: 'rules'
};
