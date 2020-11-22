const Discord = require('discord.js');
const config = require('../../config.json');
const HexColour = require('../../HexColour.json');
const database = require('../../controllers/database.js'); // Database controller

module.exports.run = async (client, message, args) => {
  // Checks if the user is in the Discord and exists.
  let user = message.mentions.members.first();
  if (!user) {
    let embed = new Discord.MessageEmbed()
      .setTitle('Error!')
      .setColor(HexColour.yellow)
      .setDescription('This user either does not exist or you did not mention a user.')
    message.channel.send(embed);
    return;
  }

  // Check for a punishement reason.
  let reason = args.slice(1).join(' ');
  if (!reason) {
    let embed = new Discord.MessageEmbed()
      .setTitle('Error!')
      .setColor(HexColour.yellow)
      .setDescription('Please provide a reason for your report.')
    message.channel.send(embed);
    return;
  }

  let createdAtRaw = message.createdAt.toDateString();
  let createdAt = createdAtRaw.split(' ');

  let embed = new Discord.MessageEmbed()
    .setTitle('Incoming Discord Report')
    .setColor(HexColour.yellow)
    .setDescription(`${message.author} has reported ${user} for ${reason}`)

  let reportschannel = message.guild.channels.cache.find(c => c.name === 'reports');
  reportschannel.send(embed).catch(e => {
    let embed = new Discord.MessageEmbed()
      .setTitle('Error!')
      .setColor(HexColour.red)
      .setDescription(`There is no #reports channel, can't display details.`)
    message.channel.send(embed);
    return;
  });
  message.delete({ timeout: 3000 });

  let confirmembed = new Discord.MessageEmbed()
    .setTitle('Error!')
    .setColor(HexColour.yellow)
    .setDescription('Your report has been sent to the Server Staff.')
  message.channel.send(confirmembed).then(msg => {msg.delete({ timeout: 3000 });});

  console.log(`[CONSOLE] [DISCORD] ${message.author.username} has reported ${user.user.username} for ${reason}.`);
  return;
};

module.exports.help = {
  name: 'report',
  description: 'Report a user, with the reason provided.',
  usage: 'report [@user] [reason]'
};
