const cron = require('node-cron');
const database = require('../controllers/database');
const config = require('../config.json');
const HexColour = require('../HexColour.json');
const Discord = require('discord.js');
const client = new Discord.Client({ disableEveryone: true });

module.exports = (client) => {
  // MONTHLY Cron Job
  const task = cron.schedule("0 7 1 * *", function() {

    // This will fire on the first of every month at 7:00am and will clear all votes from the votes table.
    database.query (`truncate votes`, function (err, results) {
      if (err) {
        throw err;
      } else {
        //
        // Discord Notification Send
        //
        let broadcastchannel = client.channels.cache.find(c => c.name === `${config.broadcastchannel}`);
        if (!broadcastchannel) return console.log(`A #${config.broadcastchannel} channel does not exist.`);

        var embed = new Discord.MessageEmbed()
          .setTitle(`Vote now cleared`)
          .setDescription(`Votes are now cleared, vote again.`)
          .setColor(HexColour.yellow)
        broadcastchannel.send(embed);
        console.log(`[CONSOLE] [CRON] Votes table has been cleared and message broadcasted.`);
      }
    });
  }, {
     scheduled: true,
     timezone: "Australia/Sydney"
  });

  task.start();
};
