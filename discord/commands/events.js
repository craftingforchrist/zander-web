const Discord = require('discord.js');
const config = require('../../config.json');
const HexColour = require('../../HexColour.json');
const database = require('../../controllers/database.js');
const moment = require('moment');

module.exports.run = async (client, message, args) => {
  database.query (`SELECT * FROM events ORDER BY eventdatetime ASC LIMIT 1;`, function (err, results) {
    if (err) {
      throw err;
    } else {
      if (!results[0]) {
        var embed = new Discord.MessageEmbed()
          .setTitle(`No Upcoming Events.`)
          .setColor(HexColor.red)
          .setDescription(`There are currently no upcoming events at the moment. Have an idea for a possible community event? Suggest it to Staff!`)
        message.channel.send(embed);
      } else {
        console.log(results);

        var embed = new Discord.MessageEmbed()
          .setTitle(results[0].title)
          .setDescription(`${moment(results[0].eventdatetime).format('LLLL')}\n\n${results[0].information}`)
          .setThumbnail(results[0].icon)
          .setColor(HexColour.evententry)
        message.channel.send(embed);
      };
    };
  });
};

module.exports.help = {
  name: 'events'
};
