const database = require('../../controllers/database');

function addaccount(username, hash) {
  database.query (`INSERT INTO accounts (username, password, status) VALUES (?, ?, ?)`, [username, hash, "ACTIVE"], function (error, results, fields) {
    if (error) {
      throw error
    };
  });
};

function deleteaccount(id) {
  database.query (`DELETE FROM accounts WHERE id=?`, [id], function (error, results, fields) {
    if (error) {
      throw error
    };
  });
};

function disableaccount(id) {
  database.query (`UPDATE accounts SET status='DISABLED' WHERE id=?`, [id], function (error, results, fields) {
    if (error) {
      throw error
    };
  });
};

function enableaccount(id) {
  database.query (`UPDATE accounts SET status='ACTIVE' WHERE id=?`, [id], function (error, results, fields) {
    if (error) {
      throw error
    };
  });
};

module.exports = {
  addaccount,
  deleteaccount,
  disableaccount,
  enableaccount
};
