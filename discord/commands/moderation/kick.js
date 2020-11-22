const Discord = require('discord.js');
const config = require('../../../config.json');
const HexColour = require('../../../HexColour.json');
const database = require('../../../controllers/database'); // Database controller
const punishment = require('../../../functions/discord/punishment');

module.exports.run = async (client, message, args) => {
  const mentioneduser = message.mentions.members.first();
  const punisheduser = `${mentioneduser.user.username}#${mentioneduser.user.discriminator}`;
  const punisheduserid = mentioneduser.user.id;
  const punisher = `${message.author.username}#${message.author.discriminator}`;
  const punisherid = message.author.id;
  const punishtype = "KICK";

  // Checks if the user has permissions to run the command.
  if (!message.member.hasPermission(`${module.exports.help.permission}`)) {
    let embed = new Discord.MessageEmbed()
      .setTitle('Error!')
      .setColor(HexColour.red)
      .setDescription('You do not have permissions to run this command.')
    message.channel.send(embed);
    return;
  }

  // Checks if the user is in the Discord and exists.
  if (!mentioneduser) {
    let embed = new Discord.MessageEmbed()
      .setTitle('Error!')
      .setColor(HexColour.red)
      .setDescription('This user does not exist.')
    message.channel.send(embed);
    return;
  }

  // Checks if you can punish the user.
  if (mentioneduser.hasPermission(`${module.exports.help.permission}`)) {
    let embed = new Discord.MessageEmbed()
      .setTitle('Error!')
      .setColor(HexColour.red)
      .setDescription('You cannot punishment this user.')
    message.channel.send(embed);
    return;
  }

  // Check for a punishement reason.
  let reason = args.slice(1).join(' ');
  if (!reason) {
    let embed = new Discord.MessageEmbed()
      .setTitle('Error!')
      .setColor(HexColour.yellow)
      .setDescription('Please provide a valid reason for this punishment.')
    message.channel.send(embed);
    return;
  }

  let embed = new Discord.MessageEmbed()
    .setTitle('User has been Kicked')
    .setColor(HexColour.yellow)
    .addField('Kicked User:', `${mentioneduser}`)
    .addField('Kicked By:', `${message.author}`)
    .addField('Reason:', reason)

  let adminlogchannel = message.guild.channels.cache.find(c => c.name === `${config.punishmentchannel}`);
  adminlogchannel.send(embed).catch(e => {
    let embed = new Discord.MessageEmbed()
      .setTitle('Error!')
      .setColor(HexColour.red)
      .setDescription(`There is no #admin-log channel, can't display details.`)
    message.channel.send(embed);
  });

  // Send notification to the command issuing channel.
  let notificationembed = new Discord.MessageEmbed()
    .setTitle('User has been Kicked.')
    .setColor(HexColour.yellow)
    .setDescription(`${mentioneduser} has been kicked by ${message.author} for ${reason}`)
  message.channel.send(notificationembed);

  // Direct message the punished user after being punished.
  let usernotifyembed = new Discord.MessageEmbed()
    .setTitle(`You have been kicked from ${message.guild}.`)
    .setColor(HexColour.yellow)
    .setDescription(`Hello ${mentioneduser}, you have been kicked from ${message.guild}.\nYou were kicked by ${punisher} for ${reason}.\nPlease think about your actions, then rejoin the server.`)
  await mentioneduser.send(usernotifyembed).catch(e => { })

  message.guild.member(mentioneduser).kick(reason);
  punishment.addpunishment(punisheduser, punisheduserid, punisher, punisherid, punishtype, reason);
  return;
};

module.exports.help = {
  name: 'kick',
  description: 'Kicks the user from the server with the reason provided.',
  permission: 'MANAGE_MESSAGES',
  usage: 'kick [@user] [reason]'
};
