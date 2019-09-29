const Discord = require('discord.js');
const config = require('../../config.json');
const chalk = require('chalk');
const database = require('../../controllers/database.js'); // Database controller

module.exports.run = async (client, message, args) => {
  const punisheduser = user.user.tag;
  const punisheduserid = user.user.id;
  const punisher = message.author.user.tag;
  const punisherid = message.author.user.id;
  
  // Checks if the user has permissions to run the command.
  if (!message.member.hasPermission(`${module.exports.help.permission}`)) {
    let embed = new Discord.RichEmbed()
      .setTitle('Error!')
      .setColor('#ff6666')
      .setDescription(`You do not have permissions to run this command.`)
    message.channel.send(embed);
    return;
  };

  // Checks if the user is in the Discord and exists.
  let user = message.mentions.members.first();
  if (!user) {
    let embed = new Discord.RichEmbed()
      .setTitle('Error!')
      .setColor('#ff6666')
      .setDescription(`This user does not exist.`)
    message.channel.send(embed);
    return;
  };

  // Checks if you can punish the user.
  if (user.hasPermission(`${module.exports.help.permission}`)) {
    let embed = new Discord.RichEmbed()
      .setTitle('Error!')
      .setColor('#ff6666')
      .setDescription(`You cannot punish this user.`)
    message.channel.send(embed);
    return;
  };

  // Check for a punishement reason.
  let reason = args.slice(1).join(' ');
  if (!reason) {
    let embed = new Discord.RichEmbed()
      .setTitle('Error!')
      .setColor('#ff6666')
      .setDescription(`Please provide a valid reason for this punishment.`)
    message.channel.send(embed);
    return;
  };

  let createdAtRaw = message.createdAt.toDateString();
  let createdAt = createdAtRaw.split(' ');

  let embed = new Discord.RichEmbed()
    .setTitle('User has been Banned')
    .setColor('#4d79ff')
    .addField('Banned User', `${user}`)
    .addField('Banned By', `${message.author}`)
    .addField('Time', `${createdAt[0]} ${createdAt[2]} ${createdAt[1]} ${createdAt[3]}`)
    .addField('Reason', reason);

  let adminlogchannel = message.guild.channels.find(c => c.name === 'admin-log');
  adminlogchannel.send(embed).catch(e => {
    let embed = new Discord.RichEmbed()
      .setTitle('Error!')
      .setColor('#ffa366')
      .setDescription(`There is no #admin-log channel, can't display details.`)
    message.channel.send(embed);
  });

  // Send notification to the command issuing channel.
  let notificationembed = new Discord.RichEmbed()
    .setTitle('User has been Banned.')
    .setColor('#4d79ff')
    .setDescription(`${user} has been banned by ${message.author} for ${reason}`)
  message.channel.send(notificationembed);

  // Direct message the punished user after being punished.
  let usernotifyembed = new Discord.RichEmbed()
    .setTitle('You have been banned from the Server.')
    .setColor('#ff6666')
    .setDescription(`Hello ${user}, you have been banned from the ${message.guild} server.\nYou were banned by ${message.author} for ${reason}.\n\nPlease contact us if you think this ban was unfair.\nSupport Email: ${config.contactemail}`)
  await user.send(usernotifyembed).catch(e => { })

  message.guild.member(user).ban({days:7,reason:reason});

  //
  // Database Entry
  //
  let sql = `INSERT INTO discordpunishments (punisheduser, punisheduserid, punisher, punisherid, punishtype, reason) VALUES ('${punisheduser}', '${punisheduserid}', '${punisher}', '${punisherid}' 'BAN', '${reason}')`;
  database.query (sql, function (err, results) {
    if (err) {
      throw err;
    }
  });

  console.log(chalk.yellow('[CONSOLE] ' ) + chalk.blue('[DISCORD] ') + `${message.author.username} has banned ${user.user.username} for ${reason}.`);
  return;
};

module.exports.help = {
  name: 'ban',
  description: 'This will permanently bans a user from the guild with the reason provided.',
  permission: 'MANAGE_MESSAGES',
  usage: 'ban [@user] [reason]'
};
