const Discord = require('discord.js');
const config = require('../../config.json')

module.exports.run = async (client, message, args) => {
  if (args == 0) {
    let embed = new Discord.MessageEmbed()
    .setTitle('An error has occurred!')
    .setDescription('Please provide a question for your poll.')
    .setColor('FF0000');
    message.channel.send(embed);
    return
  };

  let embed = new Discord.MessageEmbed()
    .setTitle(`Poll by ${message.author.username}`)
    .setColor(config.yellow)
    .setDescription(`${args}`.split(',').join(' '));

  console.log(`[${message.guild}] ${message.author.username} has created a poll with the question: ${args}.`);
  return message.channel.send(embed)

  .then(function (message, str) {
    message.react("👍")
    message.react("👎")
  }).catch(function () {});
};

module.exports.help = {
  name: 'poll',
  description: 'Make a poll with a question with thumbs up and down reactions.',
  usage: 'poll [question]'
};
