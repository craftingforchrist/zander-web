const Discord = require('discord.js');
const config = require('../../config.json');
const HexColour = require('../../HexColour.json');
const database = require('../../controllers/database.js');

module.exports.run = async (client, message, args) => {
  database.query (`SELECT username, count(*) as votes FROM votes GROUP BY username ORDER BY votes DESC limit 1;`, function (err, results) {
    if (err) {
      throw err;
    } else {
      if (!results[0]) {
        var embed = new Discord.MessageEmbed()
          .setTitle(`Vote`)
          .setURL(`${config.website}vote`)
          .setColor(HexColour.orange)
          .setDescription(`**There are no votes recorded yet! You can be the first!**\nHelp out Crafting For Christ by voting on Minecraft Server lists! Top Voter recieves excellent perks! You can vote and see the perks over at ${config.website}vote.`)
        message.channel.send(embed);
      } else {
        var embed = new Discord.MessageEmbed()
          .setTitle(`Vote`)
          .setURL(`${config.website}vote`)
          .setColor(HexColour.yellow)
          .setDescription(`Help out Crafting For Christ by voting on Minecraft Server lists! Top Voter recieves excellent perks! You can vote and see the perks over at ${config.website}vote\n\n **${results[0].username}** currently holds the top spot at **${results[0].votes}** votes!`)
        message.channel.send(embed);
      };
    };
  });
};

module.exports.help = {
  name: 'vote'
};
