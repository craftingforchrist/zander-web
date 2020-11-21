const { TwitchOnlineTracker } = require('twitchonlinetracker');
const database = require('../controllers/database.js');
const config = require('../config.json');
const Discord = require('discord.js');
const client = new Discord.Client({ disableEveryone: true });
const HexColour = require('../HexColour.json');

module.exports = (client) => {
  database.query (`SELECT * FROM ccstreams;`, function (error, results, fields) {
    if (error) {
      console.log("Twitch Online Tracker failed to launch correctly.");
      throw error;
    } else {
      // Take all streamers from the database and put them into an array for the tracker to monitor
      var channelArray = [];
      var streamers = results.forEach(function (data) {
        channelArray.push(data.channelname);
      });

      // With polling in the zander web program, it will check for new streams every 2 hours that are added to the database,
      // But it will poll for streaming status every 10 minutes.

      // Launch the Twitch Tracker Instance
      const tracker = new TwitchOnlineTracker({
        client_id: `${process.env.twitchtrackerclientid}`, // used for api requests
        track: channelArray, // all the channels you want to track
        pollInterval: 600, // how often in between polls in seconds (we like to use 600 seconds)
        debug: false, // whether to debug to console
        start: true
      });

      tracker.on('live', function (streamData) {
        console.log(streamData);
        database.query (`UPDATE ccstreams SET viewercount = ?, status = "ONLINE" WHERE channelname = ?`, [streamData.viewer_count, streamData.user_name], function (error, results, fields) {
          if (error) {
            throw error;
          } else {
            console.log(`${streamData.user_name} has gone LIVE with ${streamData.viewer_count} viewers! Broadcasting to website.`);
            //
            // Discord Notification Send
            //
            // let contentcreatorchannel = client.channels.cache.find(c => c.name === `${config.contentcreatorchannel}`);
            // if (!contentcreatorchannel) return console.log(`A #${config.contentcreatorchannel} channel does not exist.`);
            //
            // var embed = new Discord.MessageEmbed()
            //   .setTitle(`${streamData.user_name} is now LIVE!`)
            //   .setDescription(`${streamData.user_name} is now live with ${streamData.viewer_count} viewers. Come watch live at https://www.twitch.tv/${streamData.user_name}`)
            //   .setColor(HexColour.purple)
            //   .setThumbnail(`https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c540.png`)
            // contentcreatorchannel.send(embed);
            // console.log(`[CONSOLE] [DISCORD] Broadcasting ${streamData.user_name}'s stream to #${config.contentcreatorchannel}`);
          }
        });
      });

      tracker.on('offline', function (channel) {
        database.query (`UPDATE ccstreams SET viewercount = "0", status = "OFFLINE" WHERE channelname = ?`, [streamData.user_name], function (error, results, fields) {
          if (error) {
            throw error;
          } else {
            console.log(`${streamData.user_name} has gone offine. Removing from website.`);
          }
        });
      });

      tracker.on('error', function (error) {
        throw Error(error)
      });

      setInterval(function() {
        tracker.stop();
        tracker.start();
        console.log('This is working and is rebooting.');
      }, 7200 * 1000); // 60 * 1000 milsec (we like to use 7200 which is 2 hours)
    }
  });
};
