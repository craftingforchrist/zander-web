const Discord = require('discord.js');
const config = require('../../config.json')

module.exports.run = async (client, message, args) => {
  let embed = new Discord.MessageEmbed()
    .setTitle('Help & Guides')
    .setURL(`https://guides.craftingforchrist.net/`)
    .setDescription(`Little bit stuck, looking for your questions to be answered? We have most probably covered them here: https://guides.craftingforchrist.net/`)
  message.channel.send(embed);
};

module.exports.help = {
  name: 'guides'
};
