const cron = require('node-cron');
const database = require('../controllers/database');

// Cron Job
// This will fire on the first of every month and will clear all votes from the votes table.
cron.schedule('* 1 1 *', () => {
  database.query (`DELETE * from votes`, function (err, results) {
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
