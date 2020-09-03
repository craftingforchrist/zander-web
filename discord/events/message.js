const Discord = require('discord.js');
const config = require('../../config.json')

module.exports = async message => {
  if (message.content.includes("hello there") || message.content.includes("Hello there")) {
    let embed = new Discord.MessageEmbed()
    .attachFiles("https://media.giphy.com/media/8JTFsZmnTR1Rs1JFVP/giphy.gif")
    message.channel.send(embed);
    return;
  }
}
