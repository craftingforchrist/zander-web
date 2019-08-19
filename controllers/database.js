const mysql = require('mysql');
const chalk = require('chalk');

var connection = mysql.createConnection({
  host: process.env.dbhost,
  user: process.env.dbuser,
  password: process.env.dbpassword,
  database: process.env.dbdatabase,
  multipleStatements: true
});

connection.connect(function(err) {
  if (err) {
    console.error(chalk.red('[ERROR] ') + chalk.blue('[DB] ') +  'There was an error connecting:\n' + err.stack);
    return;
  }
  console.log(chalk.yellow('[CONSOLE] ' ) + chalk.blue('[DB] ') + 'Database connection is successful. Your connection ID is ' + connection.threadId + '.');
});

module.exports = connection;
