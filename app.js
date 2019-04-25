//
// Project Dependencies
//
const express = require('express');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const mysql = require('mysql');
const ejs = require('ejs');
const package = require('./package.json');
const config = require('./config.json');

//
// Constants
//
const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
var obj = {};
var session;

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static('public'));

const connection = mysql.createConnection({
  host: process.env.databasehost || config.databasehost,
  user: process.env.databaseuser || config.databaseuser,
  password: process.env.databasepassword || config.databasepassword,
  database: process.env.databasedatabase || config.databasedatabase
});

connection.connect(function(err) {
  if (err) {
    console.error(chalk.red('[ERROR] ') + chalk.blue('[DB] ') +  'There was an error connecting:\n' + err.stack);
    return;
  }
  console.log(chalk.yellow('[CONSOLE] ' ) + chalk.blue('[DB] ') + 'Database connection is successful. Your connection ID is ' + connection.threadId + '.');
});

//
// Homepage
//
app.get('/', function (req, res) {
  res.render('index');
});

//
// Players
//
app.get('/players', function (req, res) {
  let sql = `SELECT * FROM playerdata`;
  connection.query (sql, function (err, result) {
    if (err) {
      res.redirect('/');
      throw err;
    } else {
      obj = {objdata: result};
      res.render('players', obj);
    }
  });
});

//
// Profile
//
app.get('/profile/:username', function (req, res) {
  let sql = `SELECT * FROM playerdata WHERE username='${req.params.username}'`;
  connection.query (sql, function (err, result) {
    if (err) {
      res.redirect('/');
      throw err;
    } else {
      obj = {objdata: result};
      res.render('profile', obj);
    }
  });
});

// app.post('/login', urlencodedParser, function (req, res) {
//   session = req.session;
//   session.uniqueID = req.body.username;
//
//   if (req.body.password == config.adminpanelpassword) {
//     res.redirect('/admin');
//   } else {
//     res.render('login');
//   }
// });

//
// Application Boot
//
app.listen(process.env.PORT || config.applicationlistenport, function() {
  console.log(chalk.yellow(`\n// zander-web v.${package.version}\n`) + chalk.cyan(`GitHub Repository: ${package.homepage}\nCreated By: ${package.author}`));
  console.log(chalk.yellow('[CONSOLE] ' ) + 'Application is listening to the port ' + config.applicationlistenport);
});
