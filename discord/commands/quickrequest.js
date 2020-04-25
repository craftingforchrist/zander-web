const Discord = require('discord.js');
const config = require('../../config.json')

module.exports.run = async (client, message, args) => {
  message.channel.createInvite().then((invite) => {
    let embed = new Discord.MessageEmbed()
      .setDescription('A guide to using QuickRequest can be found here: https://guides.craftingforchrist.net/general/how-does-quickrequest-work')
    message.channel.send(embed);
  });
};

module.exports.help = {
  name: 'quickrequest'
};
