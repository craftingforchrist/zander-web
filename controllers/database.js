const mysql = require('mysql');

var connection = mysql.createConnection({
  host: process.env.dbhost,
  port: process.env.dbport,
  user: process.env.dbuser,
  password: process.env.dbpassword,
  database: process.env.dbname,
  multipleStatements: true
});

connection.connect(function(err) {
  if (err) {
    console.error(`[ERROR] [DB] [zander] There was an error connecting:\n ${err.stack}`);
    connection.connect();
    return;
  }
  console.log(`[CONSOLE] [DB] [zander] Database connection is successful. Your connection ID is ${connection.threadId}.`);
});

module.exports = connection;
