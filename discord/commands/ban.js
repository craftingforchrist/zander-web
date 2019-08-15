const Discord = require('discord.js');
const config = require('../../config.json');
const chalk = require('chalk');

module.exports.run = async (client, message, args) => {
  if (!message.member.hasPermission(`${module.exports.help.permission}`)) {
    let embed = new Discord.RichEmbed()
      .setTitle('Error!')
      .setColor('#ffa366')
      .setDescription(`You do not have permissions to run this command.`)
    message.channel.send(embed);
    return;
  }

  let user = message.mentions.members.first();
  if (!user) {
    let embed = new Discord.RichEmbed()
      .setTitle('Error!')
      .setColor('#ffa366')
      .setDescription(`This user does not exist.`)
    message.channel.send(embed);
    return;
  }

  let reason = args.slice(1).join(' ');
  if (!reason) {
    let embed = new Discord.RichEmbed()
      .setTitle('Error!')
      .setColor('#ffa366')
      .setDescription(`Please provide a valid reason for this ban.`)
    message.channel.send(embed);
    return;
  }

  if (user.hasPermission(`${module.exports.help.permission}`)) {
    let embed = new Discord.RichEmbed()
      .setTitle('Error!')
      .setColor('#ffa366')
      .setDescription(`You cannot ban this user.`)
    message.channel.send(embed);
    return;
  }

  let createdAtRaw = message.createdAt.toDateString();
  let createdAt = createdAtRaw.split(' ');

  let embed = new Discord.RichEmbed()
    .setTitle('User has been banned')
    .setColor('#4d79ff')
    .addField('Banned User', `${user}`, true)
    .addField('Banned By', `${message.author}`, true)
    .addField('Time', `${createdAt[0]} ${createdAt[2]} ${createdAt[1]} ${createdAt[3]}`, true)
    .addField('Reason', reason);

  let adminlogchannel = message.guild.channels.find(c => c.name === 'admin-log');

  adminlogchannel.send(embed).catch(e => {
    errors.noLogChannel(message);
  })

  let usernotifyembed = new Discord.RichEmbed()
    .setTitle('You have been banned from the Server.')
    .setColor('#ffa366')
    .setDescription(`Hello ${user}, you have been banned from the ${message.guild} server.\nYou were banned by ${message.author} for ${reason}.\nPlease contact us if you think this ban was unfair.\n\nSupport Email: ${config.email}`)
  await user.send(usernotifyembed).catch(e => { })

  message.guild.member(user).ban(reason);
  console.log(chalk.yellow('[CONSOLE] ' ) + chalk.blue('[DISCORD] ') + `${message.author.username} has banned ${user.user.username} for ${reason}.`);
  return
};

module.exports.help = {
  name: 'ban',
  description: 'This will permanently bans a user from the guild with the reason provided.',
  permission: 'BAN_MEMBERS',
  usage: 'ban [@user] [reason]'
};
