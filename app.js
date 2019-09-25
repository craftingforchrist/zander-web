//
// Project Constants
//
const express = require('express');
require ('dotenv').config();
const fs = require('fs');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const mysql = require('mysql');
const ejs = require('ejs');
const request = require('request');
const Discord = require('discord.js');
const client = new Discord.Client({ disableEveryone: true });
client.commands = new Discord.Collection();
require('./discord/util/eventLoader.js')(client);
const nodemailer = require('nodemailer');
const inlinecss = require('nodemailer-juice');

//
// File Constants
//
const package = require('./package.json');
const config = require('./config.json');

//
// Controllers
//
const database = require('./controllers/database.js'); // Database controller
const transporter = require('./controllers/mail.js'); // Nodemailer Mail controller

//
// Constants
//
const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//
// Global Website Variables
//
app.use((req, res, next) => {
  res.locals.servername = config.servername; // Set the server name.
  res.locals.sitecolour = config.sitecolour; // Set the sit colour.
  res.locals.contactemail = config.contactemail; // Set the servers contact email.
  res.locals.serverip = config.serverip; // Set the server ip.
  res.locals.website = config.website; // Set the website address.
  res.locals.description = config.description; // Set the description for the website.
  res.locals.weblogo = config.weblogo; // Set the logo.
  res.locals.webvideobackground = config.webvideobackground; // Set the moving video background.
  res.locals.webfavicon = config.webfavicon; // Set the website icon.

  res.locals.contentcreatorsmd = config.contentcreatorsmd;
  res.locals.developersmd = config.developersmd;
  res.locals.termsmd = config.termsmd;
  res.locals.privacymd = config.privacymd;
  res.locals.rulesmd = config.rulesmd;

  res.locals.twitter = config.twitterlink;
  res.locals.facebook = config.facebooklink;
  res.locals.instagram = config.instagramlink;
  res.locals.reddit = config.redditlink;

  res.locals.platformemail = config.email;
  res.locals.platformdiscord = config.discord;
  res.locals.platformpatreon = config.patreon;
  res.locals.platformtwitter = config.twitter;
  res.locals.platformfacebook = config.facebook;
  res.locals.platforminstagram = config.instagram;
  res.locals.platformreddit = config.reddit;
  next();
});

//
// Site Routes
//
var index = require('./routes/index');
var players = require('./routes/players');
var punishments = require('./routes/punishments');

var terms = require('./routes/policy/terms');
var privacy = require('./routes/policy/privacy');
var rules = require('./routes/policy/rules');

var discord = require('./routes/redirect/discord');
var issues = require('./routes/redirect/issues');
var support = require('./routes/redirect/support');

var apply = require('./routes/apply/apply');
var applygame = require('./routes/apply/apply-game')(client);
var applycreator = require('./routes/apply/apply-creator')(client);
var applydeveloper = require('./routes/apply/apply-developer')(client);

var report = require('./routes/report')(client);
var contact = require('./routes/contact')(client);
var feedback = require('./routes/feedback')(client);

var discord = require('./routes/redirect/discord');
var issues = require('./routes/redirect/issues');
var support = require('./routes/redirect/support');
var forums = require('./routes/forums');

var admin = require('./routes/admin/admin');

app.use('/', index);
app.use('/players', players);
app.use('/punishments', punishments);

app.use('/terms', terms);
app.use('/privacy', privacy);
app.use('/rules', rules);

app.use('/apply', apply);
app.use('/apply/game', applygame);
app.use('/apply/creator', applycreator);
app.use('/apply/developer', applydeveloper);

app.use('/report', report);
app.use('/contact', contact);
app.use('/feedback', feedback);

app.use('/discord', discord);
app.use('/issues', issues);
app.use('/support', support);
app.use('/forums', forums);

app.use('/admin', admin);

//
// Profile
//
app.get('/profile/:username', function (req, res) {
  let sql = `SELECT * FROM playerdata WHERE username='${req.params.username}'; select if((select gamesessions.id from gamesessions left join playerdata pd on pd.id = gamesessions.player_id where gamesessions.sessionstart <= NOW() and sessionend is NULL and pd.username = '${req.params.username}'), 'Online', 'Offline') as 'status'; select SEC_TO_TIME(sum(TIME_TO_SEC(timediff(gamesessions.sessionend, gamesessions.sessionstart)))) as 'timeplayed' from sessions ses left join playerdata pd on pd.id = gamesessions.player_id where pd.username = '${req.params.username}'; SELECT count(ses.id) as 'joins' from gamesessions ses left join playerdata pd on pd.id = ses.player_id where pd.username = '${req.params.username}'; select p.username, timediff(lp.lp_timestamp, NOW()) as 'lastseen' from (select ses.player_id, greatest(max(gamesessions.sessionend), max(gamesessions.sessionstart)) as 'lp_timestamp' from sessions ses group by ses.player_id) as lp left join playerdata p on p.id = lp.player_id where username = '${req.params.username}';`;
  database.query (sql, function (err, results) {
    if (err) {
      res.redirect('/');
      throw err;
    } else {
      res.render('profile', {
        "pagetitle": `${req.params.username}'s Profile`,
        objdata: results
      });
    }
  });
});

//
// Discord Commands & Integration
//
// Reads all commands & boot them in.
fs.readdir('./discord/commands', (err, files) => {
  if (err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === 'js')
  if (jsfile.length <= 0) {
    console.log(chalk.red('Couldn\'t find commands.'));
    return
  }

  jsfile.forEach((files, i) => {
    let props = require(`./discord/commands/${files}`);
    console.log(chalk.yellow('[CONSOLE] ' ) + chalk.blue('[DISCORD] ') + chalk.yellow(files) + ` has been loaded.`);
    client.commands.set(props.help.name, props);
  })
});

client.on("message", (message) => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  let prefix = process.env.discordprefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  if (!cmd.startsWith(prefix)) return;
  let commandfile = client.commands.get(cmd.slice(prefix.length));
  if (commandfile) commandfile.run(client, message, args);
});

//
// Application Boot
//
const port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log(chalk.yellow(`\n// zander-web v.${package.version}\n`) + chalk.cyan(`GitHub Repository: ${package.homepage}\nCreated By: ${package.author}`));
  console.log(chalk.yellow('[CONSOLE] ' ) + `Application is listening to the port ${port}`);

  client.login(process.env.discordapitoken);

  client.on("ready", () => {
    console.log(chalk.yellow('[CONSOLE] ' ) + chalk.blue('[DISCORD] ') + 'Launched Discord web-side.');
  });
});
