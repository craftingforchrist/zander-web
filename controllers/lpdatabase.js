const mysql = require('mysql');
const chalk = require('chalk');

var connection = mysql.createConnection({
  host: process.env.lpdbhost,
  user: process.env.lpdbuser,
  password: process.env.lpdbpassword,
  database: process.env.lpdbname,
  multipleStatements: true
});

connection.connect(function(err) {
  if (err) {
    console.error(`[ERROR] [DB] [LP] There was an error connecting:\n ${err.stack}`);
    connection.connect();
    return;
  }
  console.log(`[CONSOLE] [DB] [LP] Database connection is successful. Your connection ID is ${connection.threadId}.`);
});

module.exports = connection;
