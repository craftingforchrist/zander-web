const { TwitchOnlineTracker } = require('twitchonlinetracker');
const database = require('../controllers/database.js');
const config = require('../config.json');

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

    // Launch the Twitch Tracker Instance
    const tracker = new TwitchOnlineTracker({
      client_id: `${process.env.twitchtrackerclientid}`, // used for api requests
      track: channelArray, // all the channels you want to track
      pollInterval: 600, // how often in between polls in seconds
      debug: false, // whether to debug to console
      start: true
    });

    tracker.on('live', function (streamData) {
      database.query (`UPDATE ccstreams SET streamtitle = ?, viewercount = ?, status = "ONLINE" WHERE channelname = ?`, [escape(streamData.title), streamData.viewer_count, streamData.user_name], function (error, results, fields) {
        if (error) {
          throw error;
        } else {
          console.log(`${streamData.user_name} has gone LIVE with ${streamData.viewer_count} viewers! Broadcasting to website.`);
        }
      });
    });

    tracker.on('offline', function (channel) {
      database.query (`UPDATE ccstreams SET streamtitle = ?, viewercount = "0", status = "OFFLINE" WHERE channelname = ?`, [escape(streamData.title), streamData.user_name], function (error, results, fields) {
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
  }
});

function rebootTracker(tracker) {
  tracker.stop();
  tracker.start();
}

module.exports = TwitchOnlineTracker;
