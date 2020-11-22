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

  let user = args[0];
  if (!user) {
    let embed = new Discord.MessageEmbed()
      .setTitle('Error!')
      .setColor(HexColour.red)
      .setDescription(`This user does not exist.`)
    message.channel.send(embed);
    return;
  };

  if (message.guild.members.get(user)) {
    let embed = new Discord.MessageEmbed()
      .setTitle('Error!')
      .setColor(HexColour.yellow)
      .setDescription(`This user is not banned.`)
    message.channel.send(embed);
    return;
  };

  let reason = args.slice(1).join(' ');
  if (!reason) {
    let embed = new Discord.MessageEmbed()
      .setTitle('Error!')
      .setColor(HexColour.yellow)
      .setDescription(`This user does not exist.`)
    message.channel.send(embed);
    return;
  };

  let createdAtRaw = message.createdAt.toDateString();
  let createdAt = createdAtRaw.split(' ');

  let embed = new Discord.MessageEmbed()
    .setTitle('User has been unbanned')
    .setColor(HexColour.yellow)
    .addField('Unbanned User', `${user}`)
    .addField('Unbanned By', `${message.author}`)
    .addField('Time', `${createdAt[0]} ${createdAt[2]} ${createdAt[1]} ${createdAt[3]}`)
    .addField('Reason', reason);

    // Send notification to the command issuing channel.
    let notificationembed = new Discord.MessageEmbed()
      .setTitle('User has been Unbanned.')
      .setColor(HexColour.yellow)
      .setDescription(`${user} has been unbanned by ${message.author} for ${reason}`)
    message.channel.send(notificationembed);

  let adminlogchannel = message.guild.channels.cache.find(c => c.name === 'admin-log');

  adminlogchannel.send(embed).catch(e => {
    let embed = new Discord.MessageEmbed()
      .setTitle('Error!')
      .setColor(HexColour.red)
      .setDescription(`There is no #admin-log channel, can't display details.`)
    message.channel.send(embed);
  });
  message.guild.unban(user);

  console.log(`${message.author.username} has unbanned ${user.user.username} from ${message.guild} for ${reason}.`);
  return
};

module.exports.help = {
  name: 'unban',
  description: 'This will unban a user from the guild with the reason provided.',
  permission: 'BAN_MEMBERS',
  usage: 'unban [user id] [reason]'
};
