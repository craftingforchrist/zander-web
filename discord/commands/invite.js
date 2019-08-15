const Discord = require('discord.js');
const chalk = require('chalk');
const config = require('../../config.json')

module.exports.run = async (client, message, args) => {
  message.channel.createInvite().then((invite) => {
    let embed = new Discord.RichEmbed()
      .setTitle('Invite Created!')
      .setColor('#ffa366')
      .setURL(`https://discord.gg/${invite.code}`)
      .setDescription(`Successfully created an invite!\nhttps://discord.gg/${invite.code}`)
    message.channel.send(embed);

    console.log(chalk.yellow(`[CONSOLE]`) + ` ${message.author.username} has generated an invite: https://discord.gg/${invite.code}`);
  });
};

module.exports.help = {
  name: 'invite'
};
