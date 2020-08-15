var { Client, MessageEmbed } = require('discord.js');
var config = require('../../../config.json');
var fetch = require('node-fetch');

module.exports.run = async (client, message, args) => {
	if (message.content.toLowerCase().startsWith(process.env.discordprefix + 'leaderboard') || message.content.toLowerCase().startsWith(process.env.discordprefix + 'lb')) {
		if (!args[0]) {
      let embed = new MessageEmbed();
      embed.setTitle(`Incorrect Command Usage.`);
      embed.setColor('RED');
      embed.setDescription(`${process.env.discordprefix}leaderboard [xp|kills|wins|losses]`);
      message.channel.send(embed);
    };

		if (args[0].toLowerCase() === 'xp' || args[0].toLowerCase() === 'level') {
			let response = await fetch(config.tgmapiurl + '/mc/leaderboard/xp');
			let leaderboard = await response.json();
			let leaderboardmessage = [];
			var count = 0;
			leaderboard.slice(0, 10).forEach(player => {
				count++;
				if (count !== 11) { leaderboardmessage.push(`${getNumberEmoji(count)} **${player.name}** (level ${player.level})`);	}
			});

			let embed = new MessageEmbed();
			embed.setTitle(`Top 10 players (sorted by xp)`);
			embed.setColor('RED');
			embed.setDescription(leaderboardmessage.join('\n'));
			message.channel.send(embed);

		} else if (args[0].toLowerCase() === 'kills' || args[0].toLowerCase() === 'kill') {
			let response = await fetch(config.tgmapiurl + '/mc/leaderboard/kills');
			let leaderboard = await response.json();
			let leaderboardmessage = [];
			var count = 0;
			leaderboard.slice(0, 10).forEach(player => {
				count++;
				if (count !== 11) { leaderboardmessage.push(`${getNumberEmoji(count)} **${player.name}** (${player.kills} kills)`);	}
			});

			let embed = new MessageEmbed();
			embed.setTitle(`Top 10 players on (sorted by kills)`);
			embed.setColor('RED');
			embed.setDescription(leaderboardmessage.join('\n'));
			message.channel.send(embed);

		} else if (args[0].toLowerCase() === 'wins' || args[0].toLowerCase() === 'win') {
			let response = await fetch(config.tgmapiurl + '/mc/leaderboard/wins');
			let leaderboard = await response.json();
			let leaderboardmessage = [];
			var count = 0;
			leaderboard.slice(0, 10).forEach(player => {
				count++;
				if (count !== 11) { leaderboardmessage.push( `${getNumberEmoji(count)} **${player.name}** (${player.wins} wins)`); }
			});

			let embed = new MessageEmbed();
			embed.setTitle(`Top 10 players on (sorted by wins)`);
			embed.setColor('RED');
			embed.setDescription(leaderboardmessage.join('\n'));
			message.channel.send(embed);

		} else if (args[0].toLowerCase() === 'losses' || args[0].toLowerCase() === 'loss' || args[0].toLowerCase() === 'lose') {
			let response = await fetch(config.tgmapiurl + '/mc/leaderboard/losses');
			let leaderboard = await response.json();
			let leaderboardmessage = [];
			var count = 0;
			leaderboard.slice(0, 10).forEach(player => {
				count++;
				if (count !== 11) {	leaderboardmessage.push(`${getNumberEmoji(count)} **${player.name}** (${player.losses} losses)`);	}
			});

			let embed = new MessageEmbed();
			embed.setTitle(`Top 10 players on (sorted by losses)`);
			embed.setColor('RED');
			embed.setDescription(leaderboardmessage.join('\n'));
			message.channel.send(embed);

		} else {
      let embed = new MessageEmbed();
      embed.setTitle(`Incorrect Command Usage.`);
      embed.setColor('RED');
      embed.setDescription(`${process.env.discordprefix}leaderboard [xp|kills|wins|losses]`);
      message.channel.send(embed);
		}
	};
};

const getNumberEmoji = place => {
	switch (place) {
		case 1:
			return ':one:';
		case 2:
			return ':two:';
		case 3:
			return ':three:';
		case 4:
			return ':four:';
		case 5:
			return ':five:';
		case 6:
			return ':six:';
		case 7:
			return ':seven:';
		case 8:
			return ':eight:';
		case 9:
			return ':nine:';
		case 10:
			return ':keycap_ten:';
		default:
			return ':question:';
	}
};

module.exports.help = {
  name: "leaderboard",
  description: "Display the Server leaderboard in multiple different areas.",
  usage: "leaderboard [xp|kills|wins|losses]"
};
