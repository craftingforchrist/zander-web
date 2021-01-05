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
  if (userRolesArr.some(role => config.administrationroles.includes(role))) {
    // console.log("You have access.");
  } else {
    let embed = new Discord.MessageEmbed()
      .setTitle('Error!')
      .setColor('#ff6666')
      .setDescription('You do not have permission to execute this command.')
    message.channel.send(embed).then(msg => msg.delete({ timeout: 3000 }));
    return;
  };

  let unbanUser = args[0];
  if (!unbanUser) {
    let embed = new Discord.MessageEmbed()
      .setTitle('Error!')
      .setColor(HexColour.red)
      .setDescription(`This user does not exist.`)
    message.channel.send(embed);
    return;
  };

  if (message.guild.members.get(unbanUser)) {
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
