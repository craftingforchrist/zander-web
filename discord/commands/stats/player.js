var { Client, MessageEmbed } = require('discord.js');
var fetch = require('node-fetch');

module.exports.run = async (client, message, args) => {
  if (!args[0]) {
    let embed = new MessageEmbed();
    embed.setTitle(`Incorrect Command Usage.`);
    embed.setColor('RED');
    embed.setDescription(`${process.env.discordprefix}player <playername>`);
    message.channel.send(embed);
  };

  let response = await fetch(`${process.env.tgmapiurl}/mc/player/${args[0].toLowerCase()}?simple=true`);
  let body = await response.json();
  if (body['notFound']) {
    let embed = new MessageEmbed();
    embed.setTitle(`Invalid Player.`);
    embed.setColor('RED');
    embed.setDescription(`The player that you have requested does not exist.`);
    message.channel.send(embed);
  }

  let embed = new MessageEmbed();
  console.log(body.user);
  embed.setTitle(`${args[0]}'s statistics`);
  embed.setColor('RED');
  embed.setDescription(`Displaying **${args[0]}**'s statistics.`);
  embed.setThumbnail(`https://crafatar.com/avatars/${body.user.uuid}`);
  embed.addField('Kills', body.user.kills ? body.user.kills : '0', true);
  embed.addField('Deaths', body.user.deaths ? body.user.deaths : '0', true);
  embed.addField('Matches Played', body.user.matches, true);
  // embed.addField('First joined', new Date(body.user.initialJoinDate).toUTCString(), true);
  embed.addField('Last joined', new Date(body.user.lastOnlineDate).toUTCString(), true);
  embed.addField('Wins', body.user.wins ? body.user.wins : '0', true);
  embed.addField('Losses', body.user.losses, true);
  embed.addField('W/L', (body.user.wins / body.user.losses).toFixed(2), true);
  embed.addField('K/D', body.user.kills !== 0 && body.user.deaths !== 0 ? (body.user.kills / body.user.deaths).toFixed(2) : '*(None)*', true);
  embed.addField('Level', body.user.level, true);
  embed.addField('Wool Destroys', body.user.wool_destroys, true);
  message.channel.send(embed);
};

const colourRegex = /&[0-9A-FK-OR]/gi;
var stripColoursFromTags = tags => {
	return tags.map(t => `\`${t.replace(colourRegex, '')}\``);
};

var getPlayerRanks = async playerName => {
	let response = await fetch(process.env.apiUrl + `/mc/player/${playerName}/ranks`);
	let playerRankList = await response.json();
	return playerRankList;
};

module.exports.help = {
  name: "player",
  description: "Grab a player's stats profile.",
  usage: "player <username>"
};
