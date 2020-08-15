var { Client, MessageEmbed } = require('discord.js');
var config = require('../../../config.json');
var fetch = require('node-fetch');

module.exports.run = async (client, message, args) => {
  try {
    let response = await fetch(config.apiUrl + '/mc/death/latest');
    let deaths = await response.json();
    var deathmessage = [];
    deaths.forEach(death => {
      if (!death.killerLoaded) death.killerLoaded = { name: 'Environment' };
      time = new Date(death.date).toString().split(' ')[4];
      deathmessage.push(`🔹 \`${time}\` **${death.killerLoaded.name}** killed **${death.playerLoaded.name}** with **${death.killerItem}**`);
    });

    let embed = new MessageEmbed();
    embed.setTitle(`4 most recent deaths`);
    embed.setColor('RED');
    embed.setDescription(deathmessage.join('\n'));
    embed.setFooter('Due to API limitations, only 4 deaths can be displayed.');
    message.channel.send(embed);
  } catch (err) {
    let embed = new MessageEmbed();
    embed.setTitle(`An error occurred.`);
    embed.setColor('RED');
    embed.setDescription(err);
    message.channel.send(embed);
  }
};

module.exports.help = {
  name: "deaths",
  description: "A commands that displays the 4 most recent deaths.",
  usage: "deaths"
};
