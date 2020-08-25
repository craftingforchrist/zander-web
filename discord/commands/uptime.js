const Discord = require('discord.js');
const config = require('../../config.json');
const moment = require("moment");
require("moment-duration-format");

module.exports.run = async (client, message, args) => {
  const duration = moment.duration(client.uptime).format("d [days], h [hours], m [minutes], s [seconds]");

  let embed = new Discord.MessageEmbed()
    .setTitle('Website & Discord Uptime')
    .setDescription(`I have been up for ${duration}`)
  message.channel.send(embed);
};

module.exports.help = {
  name: 'uptime'
};
