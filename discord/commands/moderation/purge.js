const Discord = require('discord.js');
const HexColour = require('../../../HexColour.json');

module.exports.run = async (client, message, args) => {
  // Checks if the user has permissions to run the command.
  if (!message.member.hasPermission(`${module.exports.help.permission}`)) {
    let embed = new Discord.MessageEmbed()
      .setTitle('Error!')
      .setColor(HexColour.red)
      .setDescription('You do not have permissions to run this command.')
    message.channel.send(embed);
    return;
  }

  // Checks if ammount is a number.
  if (isNaN(args[0])) {
    let embed = new Discord.MessageEmbed()
      .setTitle('Error!')
      .setColor(HexColour.yellow)
      .setDescription('What you have entered is not a number, please try again.')
    message.channel.send(embed);
    return;
  }

  // Discords API won't delete anything above 100 messages.
  // Checks if number is above 100.
  if (args[0] > 100) {
    let embed = new Discord.MessageEmbed()
      .setTitle('Error!')
      .setColor(HexColour.yellow)
      .setDescription('You cannot delete more than 100 messages at one time. Please enter a number below 100.')
    message.channel.send(embed);
    return;
  }

  if (args[0] < 1) {
    let embed = new Discord.MessageEmbed()
      .setTitle('Error!')
      .setColor(HexColour.red)
      .setDescription('You must enter a number more than 1.')
    message.channel.send(embed);
    return;
  }

  message.channel.bulkDelete(args[0]).then(() => {
    let embed = new Discord.MessageEmbed()
      .setTitle('Messages Cleared!')
      .setColor(HexColour.green)
      .setDescription(`${message.author.username} deleted ${args[0]} messages.`)
    message.channel.send(embed).then(msg => {msg.delete(3000)});
    return
  })

  let createdAtRaw = message.createdAt.toDateString();
  let createdAt = createdAtRaw.split(' ');

  let embed = new Discord.MessageEmbed()
    .setTitle('Messages Purged!')
    .setColor(HexColour.yellow)
    .setDescription(`${args} messages have been purged from ${message.channel} by ${message.author}`)

  let adminlogchannel = message.guild.channels.cache.find(c => c.name === 'admin-log');
  adminlogchannel.send(embed).catch(e => {
    let embed = new Discord.MessageEmbed()
      .setTitle('Error!')
      .setColor(HexColour.red)
      .setDescription(`There is no #admin-log channel, can't display details.`)
    message.channel.send(embed);
  });

  console.log(`[CONSOLE] [DISCORD] ${args} messages have been purged from ${message.channel.name} by ${message.author.username}`);
  return
};

module.exports.help = {
  name: 'purge',
  description: 'This allows messages to be deleted from a channel.',
  permission: 'MANAGE_MESSAGES',
  usage: 'purge [number of messages [max 100]]'
};
