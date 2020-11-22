const mysql = require('mysql');

var connection = mysql.createConnection({
  host: process.env.dbhost,
  port: process.env.dbport,
  user: process.env.dbuser,
  password: process.env.dbpassword,
  database: process.env.lpdbname,
  multipleStatements: true
});

connection.connect(function (err) {
  if (err) {
    console.error(`[ERROR] [DB] [LP] There was an error connecting:\n ${err.stack}`);
    connection.connect();
    return;
  }
  console.log(`[CONSOLE] [DB] [LP] Database connection is successful. Your connection ID is ${connection.threadId}.`);
});

module.exports = connection;
