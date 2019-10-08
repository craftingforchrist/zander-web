const database = require('../../controllers/database');

//
// Add Discord Punishment to Database
//
function addpunishment(punisheduser, punisheduserid, punisher, punisherid, punishtype, reason) {
  database.query (`INSERT INTO discordpunishments (punisheduser, punisheduserid, punisher, punisherid, punishtype, reason) VALUES (?, ?, ?, ?, ?, ?)`, [punisheduser, punisheduserid, punisher, punisherid, punishtype, reason], function (err, results) {
    if (err) {
      throw err;
    } else {
      console.log(`[CONSOLE] [DISCORD] ${punisher} ${punishtype} ${punisheduser} for ${reason}`);
      console.log(`[CONSOLE] [DB] Punishment has been added to the database.`);
    }
  });
};

module.exports = {
  addpunishment
};
