const config = require('../config.json');
const Discord = require('discord.js');
const client = new Discord.Client({ disableEveryone: true });
const broadcastchannel = config.broadcastchannel;
//
// Discord Broadcast
//
function discord(message) {
  let broadcastchannel = client.channels.find(c => c.name === broadcastchannel);
  if (!broadcastchannel) return console.log('A broadcast channel does not exist.');

  var embed = new Discord.RichEmbed()
    .setTitle('Platform Broadcast')
    .setDescription(`${message}`)
    .setColor('#FFA500')
  broadcastchannel.send(embed);
};

module.exports = {
  discord
};
