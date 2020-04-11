const mysql = require('mysql');

var connection = mysql.createConnection({
  host: process.env.dbhost,
  user: process.env.abdbuser,
  password: process.env.abdbpassword,
  database: process.env.abdbname,
  multipleStatements: true
});

connection.connect(function (err) {
  if (err) {
    console.error(`[ERROR] [DB] [AB] There was an error connecting:\n ${err.stack}`);
    connection.connect();
    return;
  }
  console.log(`[CONSOLE] [DB] [AB] Database connection is successful. Your connection ID is ${connection.threadId}.`);
});

module.exports = connection;
