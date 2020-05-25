const Discord = require('discord.js');
const config = require('../../config.json');
const database = require('../../controllers/database.js');

module.exports.run = async (client, message, args) => {
  database.query (`SELECT username, count(*) as votes FROM votes GROUP BY username ORDER BY votes DESC limit 1;`, function (err, results) {
    if (err) {
      throw err;
    } else {
      var embed = new Discord.MessageEmbed()
        .setTitle(`Vote`)
        .setURL(`${config.website}vote`)
        .setColor('#ffa500')
        .setDescription(`Help out Crafting For Christ by voting on Minecraft Server lists! Top Voter recieves excellent perks! You can vote and see the persk over at ${config.website}vote\n\n **${results[0].username}** currently holds the top spot at **${results[0].votes}**!`)
      message.channel.send(embed);
    }
  });
};

module.exports.help = {
  name: 'vote'
};
