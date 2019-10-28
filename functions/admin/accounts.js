const database = require('../../controllers/database');

function addaccount(username, hash) {
  database.query (`INSERT INTO accounts (username, password) VALUES (?, ?)`, [username, hash], function (error, results, fields) {
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

module.exports = {
  addaccount,
  deleteaccount
};
