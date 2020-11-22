const config = require('../config.json');
const HexColour = require('../HexColour.json');
const Discord = require('discord.js');
const client = new Discord.Client({ disableEveryone: true });

//
// Discord Broadcast
//
function discord(message) {
  let broadcastchannel = client.channels.find(c => c.name === `${config.broadcastchannel}`);
  if (!broadcastchannel) return console.log('A broadcast channel does not exist.');

  var embed = new Discord.RichEmbed()
    .setTitle('Platform Broadcast')
    .setDescription(`${message}`)
    .setColor(HexColour.orange)
  broadcastchannel.send(embed);
};

module.exports = {
  discord
};
