const Discord = require('discord.js');
const config = require('../../config.json');
const HexColour = require('../../HexColour.json');
const database = require('../../controllers/database.js'); // Database Controller

module.exports.run = async (client, message, args) => {
    //
    // Database Entry
    //
    let sql = `SELECT * FROM servers WHERE visable = true ORDER BY position ASC;`;
    database.query (sql, function (err, results) {
      if (err) {
        throw err;
      } else {
        console.log(results);

        let embed = new Discord.MessageEmbed()
        .setTitle(`Network Servers`)
        .setColor(HexColour.yellow)

        results.forEach(function(serverdata) {
          embed.addField(`${serverdata.name} [${serverdata.ipaddress}]`, `${serverdata.description}`)
        })
        message.channel.send(embed);
      }
    });
};

module.exports.help = {
  name: 'play',
  description: 'Lists all Servers that are in the Server list.',
  usage: 'play'
};
