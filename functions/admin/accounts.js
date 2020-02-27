const database = require('../../controllers/database');

function addaccount(username, hash, res) {
  database.query (`SELECT username FROM accounts WHERE username = ?`, [username], function (error, results, fields) {
    if (error) {
      throw error
    };
    if (results[0]) {
      console.log(`[CONSOLE] [ADMIN] An account by the name of ${username} was attempted to be created but already exists.`);
    } else {
      database.query (`INSERT INTO accounts (username, password, status) VALUES (?, ?, ?)`, [username, hash, "ACTIVE"], function (error, results, fields) {
        if (error) {
          throw error
        };
        console.log(`[CONSOLE] [ADMIN] A new account has been created: ${username}`);
      });
    }
  });
};

function deleteaccount(id) {
  database.query (`SELECT username FROM accounts WHERE id=?; DELETE FROM accounts WHERE id=?`, [id, id], function (error, results, fields) {
    if (error) {
      throw error
    };
    console.log(`[CONSOLE] [ADMIN] ${results[0].username} has been removed.`);
  });
};

function disableaccount(id) {
  database.query (`SELECT username FROM accounts WHERE id=?; UPDATE accounts SET status='DISABLED' WHERE id=?`, [id, id], function (error, results, fields) {
    if (error) {
      throw error
    };
    console.log(`[CONSOLE] [ADMIN] ${results[0][0].username}'s account has been disabled.`);
  });
};

function enableaccount(id) {
  database.query (`SELECT username FROM accounts WHERE id=?; UPDATE accounts SET status='ACTIVE' WHERE id=?`, [id, id], function (error, results, fields) {
    if (error) {
      throw error
    };
    console.log(`[CONSOLE] [ADMIN] ${results[0][0].username}'s account has been reenabled.`);
  });
};

module.exports = {
  addaccount,
  deleteaccount,
  disableaccount,
  enableaccount
};
