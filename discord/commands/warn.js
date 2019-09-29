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
      .setDescription('You do not have permissions to run this command.')
    message.channel.send(embed);
    return;
  }

  // Checks if the user is in the Discord and exists.
  let user = message.mentions.members.first();
  if (!user) {
    let embed = new Discord.RichEmbed()
      .setTitle('Error!')
      .setColor('#ff6666')
      .setDescription('This user does not exist.')
    message.channel.send(embed);
    return;
  }

  // Checks if you can punish the user.
  if (user.hasPermission(`${module.exports.help.permission}`)) {
    let embed = new Discord.RichEmbed()
      .setTitle('Error!')
      .setColor('#ff6666')
      .setDescription('You cannot punishment this user.')
    message.channel.send(embed);
    return;
  }

  // Check for a punishement reason.
  let reason = args.slice(1).join(' ');
  if (!reason) {
    let embed = new Discord.RichEmbed()
      .setTitle('Error!')
      .setColor('#ff6666')
      .setDescription('Please provide a valid reason for this punishment.')
    message.channel.send(embed);
    return;
  }

  let createdAtRaw = message.createdAt.toDateString();
  let createdAt = createdAtRaw.split(' ');

  let embed = new Discord.RichEmbed()
    .setTitle('User has been Warned')
    .setColor('#4d79ff')
    .addField('Kicked User:', `${user}`)
    .addField('Kicked By:', `${message.author}`)
    .addField('Time', `${createdAt[0]} ${createdAt[2]} ${createdAt[1]} ${createdAt[3]}`)
    .addField('Reason:', reason)

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
    .setTitle('User has been Warned.')
    .setColor('#4d79ff')
    .setDescription(`${user} has been warned by ${message.author} for ${reason}`)
  message.channel.send(notificationembed);

  // Direct message the punished user after being punished.
  let usernotifyembed = new Discord.RichEmbed()
    .setTitle('You have been warned.')
    .setColor('#ffa366')
    .setDescription(`Hello ${user}, you have been warned by ${message.author} for ${reason}.`)
  await user.send(usernotifyembed).catch(e => { })

  //
  // Database Entry
  //
  let sql = `INSERT INTO discordpunishments (punisheduser, punisheduserid, punisher, punisherid, punishtype, reason) VALUES ('${punisheduser}', '${punisheduserid}', '${punisher}', '${punisherid}' 'WARN', '${reason}')`;
  database.query (sql, function (err, results) {
    if (err) {
      throw err;
    }
  });

  console.log(chalk.yellow('[CONSOLE] ' ) + chalk.blue('[DISCORD] ') + `${punisher} has warned ${punisheduser} for ${reason}.`);
  return;
};

module.exports.help = {
  name: 'warn',
  description: 'Warn the user, with the reason provided.',
  permission: 'MANAGE_MESSAGES',
  usage: 'warn [@user] [reason]'
};
