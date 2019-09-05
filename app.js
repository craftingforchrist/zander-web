//
// Project Constants
//
const express = require('express');
const session = require('express-session');
require ('dotenv').config();
const fs = require('fs');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const mysql = require('mysql');
const ejs = require('ejs');
const request = require('request');
const cookieparser = require('cookie-parser');
const passport = require('passport');
const mysqlstore = require('express-mysql-session')(session);
const Discord = require('discord.js');
const client = new Discord.Client({ disableEveryone: true });
client.commands = new Discord.Collection();
const nodemailer = require('nodemailer');
const inlinecss = require('nodemailer-juice');
const flash = require('connect-flash');

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
require('./controllers/passport.js')(passport); // Session Management controller

//
// Constants
//
const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieparser());
app.use(flash());

//
// Session Management
//
var options = {
  host: process.env.dbhost,
  user: process.env.dbuser,
  password: process.env.dbpassword,
  database: process.env.dbname
};
const sessionstore = new mysqlstore(options);

app.use(session({
  secret: process.env.sessionsecret,
  resave: false,
  saveUninitialized: false,
  store: sessionstore,
  cookie: {
    secure: true
  }
}));
app.use(passport.initialize());
app.use(passport.session());

//
// Global Flash Messages
//
app.use((req, res, next) => {
  res.locals.successmsg = req.flash('successmsg');
  res.locals.errormsg = req.flash('errormsg');
  res.locals.noticemsg = req.flash('noticemsg');
  res.locals.error = req.flash('error'); // Flash message for passport
  next();
});

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

// var login = require('./routes/session/login');
// var logout = require('./routes/session/logout');
// var register = require('./routes/session/register');
//
// var admin = require('./routes/admin/admin');

var forums = require('./routes/forum/forums');

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

// app.use('/login', login);
// app.use('/logout', logout);
// app.use('/register', register);

// app.use('/admin', admin);

app.use('/forums', forums);

//
// Development [plugin]
//
// app.get('/development/plugin', function (req, res) {
//   var options = {
//     url: config.developmentplugindevlink,
//     headers: { 'User-Agent': 'request' }
//   };
//
//   function callback(error, response, body) {
//     if (!error && response.statusCode == 200) {
//       var info = JSON.parse(body);
//       res.redirect('/');
//       res.render('development-plugin', {
//         "servername": `${config.servername}`,
//         "sitecolour": `${config.sitecolour}`,
//         "email": `${config.email}`,
//         "pagetitle": "Plugin Development Log",
//         objdata: info
//       });
//     };
//   };
//   request(options, callback);
// });

//
// Development [web]
//
// app.get('/development/web', function (req, res) {
//   var options = {
//     url: config.developmentwebdevlink,
//     headers: { 'User-Agent': 'request' }
//   };
//
//   function callback(error, response, body) {
//     if (!error && response.statusCode == 200) {
//       var info = JSON.parse(body);
//       res.render('development-web', {
//         "servername": `${config.servername}`,
//         "sitecolour": `${config.sitecolour}`,
//         "email": `${config.email}`,
//         "pagetitle": "Web Development Log",
//         objdata: info
//       });
//     };
//   };
//   request(options, callback);
// });

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
// About
//
// app.get('/about', function (req, res) {
//   res.render('about', {
//     "pagetitle": "About"
//   });
// });

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
app.listen(process.env.port || 8080, function() {
  console.log(chalk.yellow(`\n// zander-web v.${package.version}\n`) + chalk.cyan(`GitHub Repository: ${package.homepage}\nCreated By: ${package.author}`));
  console.log(chalk.yellow('[CONSOLE] ' ) + `Application is listening to the port ${port}`);

  client.login(process.env.discordapitoken);

  client.on("ready", () => {
    console.log(chalk.yellow('[CONSOLE] ' ) + chalk.blue('[DISCORD] ') + 'Launched Discord web-side.');
  });
});
