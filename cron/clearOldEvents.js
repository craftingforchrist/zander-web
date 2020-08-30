const cron = require('node-cron');
const database = require('../controllers/database');

// Cron Job
// This will fire once a day to clear all events that are past.
const task = cron.schedule("0 0 0 * * *", function() {
  database.query (`truncate votes`, function (err, results) {
    if (err) {
      throw err;
    } else {
      console.log(`[CONSOLE] [CRON] Old events have been cleared.`);
    }
  });
}, {
   scheduled: true,
   timezone: "Australia/Sydney"
});

task.start();
