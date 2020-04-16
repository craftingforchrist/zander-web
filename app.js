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
const Discord = require('discord.js');
const client = new Discord.Client({ disableEveryone: true });
client.commands = new Discord.Collection();
require('./discord/util/eventLoader.js')(client);
const nodemailer = require('nodemailer');
const inlinecss = require('nodemailer-juice');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const LocalStratagy = require('passport-local');

//
// File Constants
//
const package = require('./package.json');
const config = require('./config.json');
// const SimpleNodeLogger = require('simple-node-logger'),
//   opts = {
//       logFilePath:'mylogfile.log',
//       timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS'
//   },
// log = SimpleNodeLogger.createSimpleLogger(opts);

//
// Controllers
//
const database = require('./controllers/database'); // zander Database controller
// const lpdatabase = require('./controllers/lpdatabase'); // LuckPerms Database controller
const abdatabase = require('./controllers/abdatabase'); // AdvancedBan Database controller
const transporter = require('./controllers/mail'); // Nodemailer Mail controller
// const rcon = require('./controllers/rcon'); // RCON controller
require('./controllers/passport')(passport); // Passport controller
const twitchtracker = require('./controllers/twitchtracker')(client); // Twtich Online Tracker controller

const uuid = require('./functions/uuid');

//
// Constants
//
const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());
// app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use(session({ cookie: { maxAge: 60000 },
                  secret: process.env.sessionsecret,
                  resave: true,
                  saveUninitialized: true}));
// Seems to have a common erorr at the moment:
// Warning: connect.session() MemoryStore is not designed for a production environment, as it will leak memory, and will not scale past a single process.

//
// Global Website Variables
//
app.use((req, res, next) => {
  res.locals.servername = config.servername;
  res.locals.sitecolour = config.sitecolour;
  res.locals.contactemail = config.contactemail;
  res.locals.serverip = config.serverip;
  res.locals.website = config.website;
  res.locals.description = config.description;
  res.locals.weblogo = config.weblogo;
  res.locals.webvideobackground = config.webvideobackground;
  res.locals.webfavicon = config.webfavicon;

  res.locals.contentcreatorsmd = config.contentcreatorsmd;
  res.locals.developersmd = config.developersmd;
  res.locals.termsmd = config.termsmd;
  res.locals.privacymd = config.privacymd;
  res.locals.rulesmd = config.rulesmd;
  res.locals.refundmd = config.refundmd;

  res.locals.twitter = config.twitterlink;
  res.locals.facebook = config.facebooklink;
  res.locals.instagram = config.instagramlink;
  res.locals.reddit = config.redditlink;
  res.locals.twitch = config.twitchlink;
  res.locals.discord = config.discordlink;
  res.locals.youtube = config.youtubelink;
  res.locals.giveaway = config.giveawaylink;

  res.locals.platformemail = config.email;
  res.locals.platformdiscord = config.discord;
  res.locals.platformshop = config.shop;
  res.locals.platformtwitter = config.twitter;
  res.locals.platformfacebook = config.facebook;
  res.locals.platforminstagram = config.instagram;
  res.locals.platformreddit = config.reddit;
  res.locals.platformtwitch = config.twitch;
  res.locals.platformyoutube = config.youtube;

  // res.locals.gameserverapp = config.gameserverapp;
  res.locals.contentcreatorapp = config.contentcreatorapp;
  res.locals.developerapp = config.developerapp;
  res.locals.juniorstaffapp = config.juniorstaffapp;
  res.locals.socialmediaapp = config.socialmediaapp;
  res.locals.builderapp = config.builderapp;

  res.locals.successalert = null;
  res.locals.erroralert = null;
  res.locals.warningalert = null;
  res.locals.message = null;

  if (req.session.user) {
      res.locals.info = true
  } else {
      res.locals.info = false
  };

  next();
});

//
// Site Routes
//
var index = require('./routes/index');
// var players = require('./routes/players');
var punishments = require('./routes/punishments');
var staff = require('./routes/staff');
var events = require('./routes/events');
var live = require('./routes/live');
// var watch = require('./routes/watch');
var play = require('./routes/play');
var vote = require('./routes/vote');
var ranks = require('./routes/ranks');
var guides = require('./routes/guides');
var appeal = require('./routes/appeal');
var report = require('./routes/report')(client);

var terms = require('./routes/policy/terms');
var privacy = require('./routes/policy/privacy');
var rules = require('./routes/policy/rules');
var refund = require('./routes/policy/refund');

var discord = require('./routes/redirect/discord');
var issues = require('./routes/redirect/issues');
var support = require('./routes/redirect/support');
var giveaway = require('./routes/redirect/giveaway');

var apply = require('./routes/apply/apply');
// var applygame = require('./routes/apply/apply-game')(client);
var applycreator = require('./routes/apply/apply-creator')(client);
var applydeveloper = require('./routes/apply/apply-developer')(client);
var applyjuniorstaff = require('./routes/apply/apply-juniorstaff');
var applysocialmedia = require('./routes/apply/apply-socialmedia');
var applybuilder = require('./routes/apply/apply-builder');

var discord = require('./routes/redirect/discord');
var issues = require('./routes/redirect/issues');
var support = require('./routes/redirect/support');
var forums = require('./routes/redirect/forums');
var shop = require('./routes/redirect/shop');

var login = require('./routes/session/login');
var logout = require('./routes/session/logout');

var dashboard = require('./routes/admin/dashboard');
var accounts = require('./routes/admin/accounts/list');
var accountscreate = require('./routes/admin/accounts/create');
var accountspermissionslist = require('./routes/admin/accounts/permissions/list');
var eventsadmin = require('./routes/admin/events/list');
var eventsadmincreate = require('./routes/admin/events/create')(client);
var eventsadminedit = require('./routes/admin/events/edit');
// var application = require('./routes/admin/application');
// var whitelist = require('./routes/admin/whitelist');
var broadcast = require('./routes/admin/broadcast');
var punishment = require('./routes/admin/punishment');
var contentcreator = require('./routes/admin/contentcreator/list');
var contentcreatorcreate = require('./routes/admin/contentcreator/create');
var contentcreatordelete = require('./routes/admin/contentcreator/delete');
var stafftitlelist = require('./routes/admin/staff/title/list');
var stafftitleedit = require('./routes/admin/staff/title/edit');
var serverslist = require('./routes/admin/servers/list');
var serversedit = require('./routes/admin/servers/edit');
var serverscreate = require('./routes/admin/servers/create');
var serversdelete = require('./routes/admin/servers/delete');

app.use('/', index);
// app.use('/players', players);
app.use('/punishments', punishments);
app.use('/staff', staff);
app.use('/events', events);
app.use('/live', live);
// app.use('/watch', watch);
app.use('/play', play);
app.use('/vote', vote);
app.use('/ranks', ranks);
app.use('/guides', guides);
app.use('/appeal', appeal);

app.use('/terms', terms);
app.use('/privacy', privacy);
app.use('/rules', rules);
app.use('/refund', refund);

app.use('/apply', apply);
// app.use('/apply/game', applygame);
app.use('/apply/creator', applycreator);
app.use('/apply/developer', applydeveloper);
app.use('/apply/juniorstaff', applyjuniorstaff);
app.use('/apply/socialmedia', applysocialmedia);
app.use('/apply/builder', applybuilder);

app.use('/report', report);

app.use('/discord', discord);
app.use('/issues', issues);
app.use('/support', support);
app.use('/forums', forums);
app.use('/shop', shop);
app.use('/giveaway', giveaway);

app.use('/login', login);
app.use('/logout',logout)

app.use('/admin/dashboard', dashboard);
app.use('/admin', dashboard);
app.use('/admin/accounts', accounts);
app.use('/admin/accounts/create', accountscreate);
app.use('/admin/accounts/permissions', accountspermissionslist);
app.use('/admin/events', eventsadmin);
app.use('/admin/events/create', eventsadmincreate);
app.use('/admin/events/edit', eventsadminedit);
// app.use('/admin/application', application);
// app.use('/admin/whitelist', whitelist);
app.use('/admin/broadcast', broadcast);
app.use('/admin/punishment', punishment);
app.use('/admin/contentcreator', contentcreator);
app.use('/admin/contentcreator/create', contentcreatorcreate);
app.use('/admin/contentcreator/delete', contentcreatordelete);
app.use('/admin/staff/title', stafftitlelist);
app.use('/admin/staff/title/edit', stafftitleedit);
app.use('/admin/servers', serverslist);
app.use('/admin/servers/create', serverscreate);
app.use('/admin/servers/edit', serversedit);
app.use('/admin/servers/delete', serversdelete);

//
// Profiles
//
// app.get('/profile/:username', function (req, res) {
//   let sql = `SELECT * FROM playerdata WHERE username='${req.params.username}'; SELECT IF((SELECT gamesessions.id FROM gamesessions left join playerdata pd on pd.id = gamesessions.player_id WHERE gamesessions.sessionstart <= NOW() and gamesessions.sessionend is NULL and pd.username = '${req.params.username}'), 'Online', 'Offline') as 'status'; SELECT count(ses.id) as 'joins' FROM gamesessions ses left join playerdata pd on pd.id = ses.player_id WHERE pd.username = '${req.params.username}';`;
//   // SELECT p.username, timediff(lp.lp_timestamp, NOW()) as 'lastseen' FROM (SELECT ses.player_id, greatest(max(gamesessions.sessionend), max(gamesessions.sessionstart)) as 'lp_timestamp' FROM gamesessions ses group by ses.player_id) as lp left join playerdata p on p.id = lp.player_id WHERE username = '${req.params.username}';
//   // SELECT SEC_TO_TIME(sum(TIME_TO_SEC(timediff(gamesessions.sessionend, gamesessions.sessionstart)))) as 'timeplayed' from gamesessions ses left join playerdata pd on pd.id = gamesessions.player_id WHERE pd.username = '${req.params.username}';
//   database.query (sql, function (err, results) {
//     if (err) {
//       res.redirect('/');
//       throw err;
//     } else {
//       res.render('profile', {
//         "pagetitle": `${req.params.username}'s Profile`,
//         objdata: results
//       });
//     }
//   });
// });

//
// Application View
//
// app.get('/admin/applications/view/:id', function (req, res) {
//   if (req.session.user) {
//     let sql = `SELECT * FROM gameapplications WHERE id='${req.params.id}';`;
//     database.query (sql, function (err, results) {
//       if (err) {
//         res.redirect('/');
//         throw err;
//       } else {
//         res.render('admin/view', {
//           "pagetitle": `${results[0].username}'s Game Application`,
//           objdata: results[0]
//         });
//       }
//     });
//   } else {
//     res.render('session/login', {
//       setValue: true,
//       message: 'You cannot access this page unless you are logged in.',
//       "pagetitle": "Login"
//     });
//   }
// });

//
// GAME Punishment View
//
// app.get('/punishments/game/view/:id', function (req, res) {
//   let sql = `select p.id as 'id', p.punishtimestamp as 'timestamp', punisher.username as 'punisher', punisher.uuid as 'punisheruuid', punished.username as 'punished', punished.uuid as 'punisheduuid', p.punishtype as 'punishtype', p.reason as 'reason' from gamepunishments p left join playerdata punished on punished.id = p.punisheduser_id left join playerdata punisher on punisher.id = p.punisher_id WHERE p.id='${req.params.id}';`;
//   database.query (sql, function (err, results) {
//     if (err) {
//       res.redirect('/');
//       throw err;
//     } else {
//       res.render('punishments-game-view', {
//         "pagetitle": `${results[0].punished}'s Punishment || #${results[0].id}`,
//         objdata: results[0],
//         platform: "GAME"
//       });
//     }
//   });
// });
//
// //
// // DISCORD Punishment View
// //
// app.get('/punishments/discord/view/:id', function (req, res) {
//   let sql = `select * from discordpunishments where id='${req.params.id}';`;
//   database.query (sql, function (err, results) {
//     if (err) {
//       res.redirect('/');
//       throw err;
//     } else {
//       res.render('punishments-discord-view', {
//         "pagetitle": `${results[0].punisheduser}'s Punishment || #${results[0].id}`,
//         objdata: results[0],
//         platform: "DISCORD"
//       });
//     }
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
    console.log('Couldn\'t find commands.');
    return
  }

  jsfile.forEach((files, i) => {
    let props = require(`./discord/commands/${files}`);
    console.log(`[CONSOLE] [DISCORD] ${files} has been loaded.`);
    client.commands.set(props.help.name, props);
  })
});

app.get('*', function(req, res) {
  res.render('404', {
    "pagetitle": "404: Page Not Found"
  });
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
  console.log(`\n// zander-web v.${package.version}\nGitHub Repository: ${package.homepage}\nCreated By: ${package.author}`);
  console.log(`[CONSOLE] Application is listening to the port ${port}`);

  client.login(process.env.discordapitoken);

  client.on("ready", () => {
    console.log('[CONSOLE] [DISCORD] Launched Discord web side.');
  });
});
