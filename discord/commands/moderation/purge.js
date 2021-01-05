const Discord = require('discord.js');
const HexColour = require('../../../HexColour.json');

module.exports.run = async (client, message, args) => {
  const user = message.guild.member(message.author); // Get the command user.
  const roles = user.roles.cache; // Get the users roles.
  const userRolesArr = [];
  // Put all roles into an array.
  roles.forEach(function (data) {
    userRolesArr.push(data.name);
  });

  // Check if the user has role access to this command.
  if (userRolesArr.some(role => config.staffroles.includes(role))) {
    // console.log("You have access.");
  } else {
    let embed = new Discord.MessageEmbed()
      .setTitle('Error!')
      .setColor('#ff6666')
      .setDescription('You do not have permission to execute this command.')
    message.channel.send(embed).then(msg => msg.delete({ timeout: 3000 }));
    return;
  };

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
  usage: 'purge [number of messages [max 100]]'
};
