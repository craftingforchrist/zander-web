const cron = require('node-cron');
const moment = require('moment');
const database = require('../controllers/database');

// DAILY Cron Jobs [Firing at 7:00am]

const task = cron.schedule('0 7 * * *', function() {
  // Event Clear
  // This will fire once a day to clear all events that are past.
  database.query (`DELETE FROM events WHERE eventdatetime < "${moment().format('YYYY-MM-DD HH:mm:ss')}"`, function (err, results) {
    if (err) {
      throw err;
    } else {
      console.log(`[CONSOLE] [CRON] Old Events have been cleared.`);
    }
  });


}, {
   scheduled: true,
   timezone: "Australia/Sydney"
});

task.start();
