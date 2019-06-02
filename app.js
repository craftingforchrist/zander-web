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
const credentials = require('./credentials.json');
const request = require('request');
const nodemailer = require('nodemailer');
const hogan = require('hogan.js');
const fs = require('fs');

const Discord = require('discord.js');
const client = new Discord.Client({
  disableEveryone: true
});

//
// Constants
//
const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
var obj = {};
var session;

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static('./public'));

const connection = mysql.createConnection({
  host: process.env.dbhost || credentials.dbhost,
  user: process.env.dbuser || credentials.dbuser,
  password: process.env.dbpassword || credentials.dbpassword,
  database: process.env.dbdatabase || credentials.dbdatabase
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
  res.render('index', {
    "servername": `${config.servername}`,
    "email": `${config.email}`,
    "pagetitle": "Home"
  });
});

//
// Apply
//
app.get('/apply', function (req, res) {
  res.render('apply', {
    "servername": `${config.servername}`,
    "email": `${config.email}`,
    "pagetitle": "Apply"
  });
});

app.post('/apply', urlencodedParser, function (req, res) {
  console.log(req.body);

  try {
    let applyreportchannel = client.channels.find(c => c.name === 'apply-report');
    if (!applyreportchannel) return console.log('A #apply-report channel does not exist.');

    var embed = new Discord.RichEmbed()
      .setTitle(`New Whitelist Application [${req.body.minecraftUsernameselector}]`)
      .addField(`Username`, `${req.body.minecraftUsernameselector}`, true)
      .addField(`Discord Tag`, `${req.body.discordtagselector}`, true)
      .addField(`How did you hear about us`, `${req.body.howdidyouhearaboutusselector}`)
      .addField(`Any additional information`, `${req.body.additionalinformationselector}`)
      .setColor('#99ddff')
    applyreportchannel.send(embed);
    console.log(chalk.yellow('[CONSOLE] ') + chalk.cyan('[MAIL] ') + `Successfully sent Whitelist enquiry.`);

    res.render('index', {
      "servername": `${config.servername}`,
      "email": `${config.email}`,
      "pagetitle": "Home"
    });
  } catch {
    console.log('An error occured');
  }
});

//
// Discord Server Redirect
//
app.get('/discord', function (req, res) {
  res.redirect(`${config.discordlink}`);
});

//
// GitHub Issue Tracker Redirect
//
app.get('/issues', function (req, res) {
  res.redirect(`${config.githubissuetrackerlink}`);
});

//
// Rules
//
app.get('/rules', function (req, res) {
  res.render('rules', {
    "servername": `${config.servername}`,
    "email": `${config.email}`,
    "pagetitle": "Rules",
    rulesmd: config.rulesmd
  });
});

//
// Development [plugin]
//
app.get('/development/plugin', function (req, res) {
  var options = {
    url: 'https://api.github.com/repos/shadowolfyt/zander/commits',
    headers: { 'User-Agent': 'request' }
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      res.render('development-plugin', {
        "servername": `${config.servername}`,
        "email": `${config.email}`,
        "pagetitle": "Plugin Development Log",
        objdata: info
      });
    };
  };
  request(options, callback);
});

//
// Development [web]
//
app.get('/development/web', function (req, res) {
  var options = {
    url: 'https://api.github.com/repos/shadowolfyt/zander-web/commits',
    headers: { 'User-Agent': 'request' }
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      res.render('development-web', {
        "servername": `${config.servername}`,
        "email": `${config.email}`,
        "pagetitle": "Web Development Log",
        objdata: info
      });
    };
  };
  request(options, callback);
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
      res.render('players', {
        "servername": `${config.servername}`,
        "email": `${config.email}`,
        "pagetitle": "Players",
        objdata: result
      });
    }
  });
});

//
// Punishments
//
app.get('/punishments', function (req, res) {
  let sql = `SELECT * FROM punishments ORDER BY id DESC`;
  connection.query (sql, function (err, result) {
    if (err) {
      res.redirect('/');
      throw err;
    } else {
      res.render('punishments', {
        "servername": `${config.servername}`,
        "email": `${config.email}`,
        "pagetitle": "Punishments",
        objdata: result
      });
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
      res.render('profile', {
        "servername": `${config.servername}`,
        "email": `${config.email}`,
        "pagetitle": `${req.params.username}'s Profile`,
        objdata: result
      });
    }
  });
});

//
// Application Boot
//
app.listen(process.env.PORT || config.applicationlistenport, function() {
  console.log(chalk.yellow(`\n// zander-web v.${package.version}\n`) + chalk.cyan(`GitHub Repository: ${package.homepage}\nCreated By: ${package.author}`));
  console.log(chalk.yellow('[CONSOLE] ' ) + 'Application is listening to the port ' + process.env.PORT || config.applicationlistenport);

  client.login(process.env.token || credentials.token);
  console.log(chalk.yellow('[CONSOLE] ' ) + chalk.blue('[DISCORD] ') + 'Launched Discord web-side.');
});
