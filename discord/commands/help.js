const { Client, MessageEmbed } = require('discord.js');
const config = require('../../config.json');
const prefix = process.env.discordprefix;

module.exports.run = async (client, message, args) => {
	let embed = new MessageEmbed();
  embed.setTitle('Commands')
	embed.setColor('RED');
	embed.addField(
		'General Commands', [
			`\`${prefix}help\`\nDisplay this panel.`,
			`\`${prefix}status\`\nDisplay all instances of the Network with the current player count.`,
			`\`${prefix}uptime\`\nDisplay the uptime of the website and Discord bot.`,
			`\`${prefix}staff\`\nPing all online staff **abusing this will result in punishment**.`,
			`\`${prefix}website\`\nDisplays a link to the website.`,
			`\`${prefix}guides\`\nDisplays link to the guides site.`,
			`\`${prefix}invite\`\nGenerate a link to the Discord.`,
			`\`${prefix}play\`\nDisplays all Servers with IPs and descriptions.`,
			`\`${prefix}rules\`\nDisplays a link to the rules page.`,
			`\`${prefix}vote\`\nDisplays a link to the vote page and gives the top voter and amount of votes.`,
			`\`${prefix}poll [question]\`\nA simple poll command with :thumbsup: and :thumbsdown:`,
			`\`${prefix}ranks\`\nDisplays a link to the ranks page giving a description of all ranks and perks.`,
		].join('\n')
	);

  embed.addField(
		'Statistic Commands (Mixed)', [
			`\`${prefix}deaths\`\nDisplay the last 4 deaths.`,
			`\`${prefix}leaderboard [xp|kills|wins|losses]\`\nDisplay the top 10 players based on the leaderboard indicated.`,
			`\`${prefix}player [username]\`\nDisplay a profile based on the player indicated with their statistics.`,
		].join('\n')
	);

  // if (message.member.roles.cache.has('Administrator')) {
  //   embed.addField(
  // 		'Discord Moderation Commands', [
  // 			`\`${prefix}deaths\`\nDisplay the last 4 deaths.`,
  // 			`\`${prefix}leaderboard [xp|kills|wins|losses]\`\nDisplay the top 10 players based on the leaderboard indicated.`,
  // 			`\`${prefix}player [username]\`\nDisplay a profile based on the player indicated with their statistics.`,
  // 		].join('\n')
  // 	);
  // };

	embed.setFooter(`For support, open a ticket look at #support or email ${config.contactemail}`);
	message.channel.send(embed);
};

module.exports.help = {
  name: "help",
  description: "A list of commands that are provided.",
  usage: "help"
};
