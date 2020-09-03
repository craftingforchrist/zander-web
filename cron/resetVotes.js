const cron = require('node-cron');
const database = require('../controllers/database');

// Cron Job
// This will fire on the first of every month at 7:00am and will clear all votes from the votes table.
const task = cron.schedule("0 7 1 * *", function() {
  database.query (`truncate votes`, function (err, results) {
    if (err) {
      throw err;
    } else {
      console.log(`[CONSOLE] [CRON] Votes table has been cleared.`);
    }
  });
}, {
   scheduled: true,
   timezone: "Australia/Sydney"
});

task.start();
