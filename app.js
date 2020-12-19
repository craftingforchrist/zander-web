//
// Project Constants
//
const express = require('express');
const session = require('express-session');
require ('dotenv').config();
const fs = require('fs');
const mysql = require('mysql');
const ejs = require('ejs');
const request = require('request');
const Discord = require('discord.js');
const nodemailer = require('nodemailer');
const inlinecss = require('nodemailer-juice');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const LocalStratagy = require('passport-local');
const moment = require("moment");
const fetch = require('node-fetch');
const momentDurationFormatSetup = require("moment-duration-format");
const bodyParser = require('body-parser');

const client = new Discord.Client({ disableEveryone: true });
client.commands = new Discord.Collection();
require('./discord/util/eventLoader.js')(client);

//
// File Constants
//
const package = require('./package.json');
const config = require('./config.json');
const HexColour = require('./HexColour.json');

//
// Controllers
//
const database = require('./controllers/database'); // zander Database controller
const lpdatabase = require('./controllers/lpdatabase'); // LuckPerms Database controller
const abdatabase = require('./controllers/abdatabase'); // AdvancedBan Database controller
const transporter = require('./controllers/mail'); // Nodemailer Mail controller
require('./controllers/passport')(passport); // Passport controller
const twitchtracker = require('./controllers/twitchtracker')(client); // Twtich Online Tracker controller

//
// Cron Jobs
//
require('./cron/daily.js');
require('./cron/monthly.js')(client);

//
// Constants
//
const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(flash());
// app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use(session({
  cookie: { maxAge: 1200000 },
  secret: process.env.sessionsecret,
  resave: true,
  saveUninitialized: true
}));
// Seems to have a common error at the moment:
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
  res.locals.juniorstaffmd = config.juniorstaffmd;
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
  res.locals.linkedin = config.linkedinlink;
  res.locals.tiktok = config.tiktoklink;
  res.locals.giveaway = config.giveawaylink;
  res.locals.feedback = config.feedbacklink;

  res.locals.platformemail = config.email;
  res.locals.platformdiscord = config.discord;
  res.locals.platformshop = config.shop;
  res.locals.platformtwitter = config.twitter;
  res.locals.platformfacebook = config.facebook;
  res.locals.platforminstagram = config.instagram;
  res.locals.platformreddit = config.reddit;
  res.locals.platformtwitch = config.twitch;
  res.locals.platformyoutube = config.youtube;
  res.locals.platformlinkedin = config.linkedin;
  res.locals.platformtiktok = config.tiktok;

  res.locals.contentcreatorapp = config.contentcreatorapp;
  res.locals.developerapp = config.developerapp;
  res.locals.juniorstaffapp = config.juniorstaffapp;
  res.locals.socialmediaapp = config.socialmediaapp;
  res.locals.builderapp = config.builderapp;

  // Static Error Image Paths
  // Allows images to be called from anywhere and not to be unknown.
  res.locals.erreggs = './img/errimages/erreggs.png';
  res.locals.srvinterr = '../img/errimages/srvinterr.png';
  res.locals.playernotfound = '../img/errimages/playernotfound.png';

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

// Routes
// const authenticationRoutes = require('./routes/authenticationRoutes');
// app.use(authenticationRoutes);

const platformRoutes = require('./routes/platformRoutes');
app.use(platformRoutes);

const policyRoutes = require('./routes/policyRoutes');
app.use(policyRoutes);

const applicationRoutes = require('./routes/applicationRoutes');
app.use(applicationRoutes);

// Profiles
const playerprofile = require('./routes/playerprofile');
app.use(playerprofile);

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
var appeal = require('./routes/appeal');
var maps = require('./routes/maps');
var report = require('./routes/report')(client);

var churchduringcovid = require('./routes/churchduringcovid');
// var giveaway = require('./routes/giveaway');

var login = require('./routes/session/login');
// var logout = require('./routes/session/logout');

var dashboard = require('./routes/admin/dashboard');
var accounts = require('./routes/admin/accounts/list');
var accountscreate = require('./routes/admin/accounts/create');
var accountspermissionslist = require('./routes/admin/accounts/permissions/list');
var eventsadmin = require('./routes/admin/events/list')(client);
var eventsadmincreate = require('./routes/admin/events/create')(client);
var eventsadminedit = require('./routes/admin/events/edit')(client);
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
app.use('/appeal', appeal);
app.use('/maps', maps);

app.use('/churchduringcovid', churchduringcovid);

app.use('/report', report);
// app.use('/giveaway', giveaway);

app.use('/login', login);
// app.use('/logout',logout)

app.use('/admin/dashboard', dashboard);
app.use('/admin', dashboard);
app.use('/admin/accounts', accounts);
app.use('/admin/accounts/create', accountscreate);
app.use('/admin/accounts/permissions', accountspermissionslist);
app.use('/admin/events', eventsadmin);
app.use('/admin/events/create', eventsadmincreate);
app.use('/admin/events/edit', eventsadminedit);
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

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

//
// Profiles
//
app.get('/profile/:username', function (req, res) {
  // Query the database for the players data and online status.
  let sql = `select sessionend, sessionstart, uuid, username, joined, server,
  (IF(
  		(select gamesessions.id
  		from gamesessions
  		left join playerdata pd on pd.id = gamesessions.player_id
          where gamesessions.sessionstart <= NOW()
          and gamesessions.sessionend is NULL
          and pd.username = '${req.params.username}'
        ), 'online', 'offline'))  as 'status'
  from gamesessions, playerdata
  where player_id = playerdata.id
  and playerdata.username = '${req.params.username}'
  order by sessionstart desc
  limit 1;`

  database.query (sql, async function (err, zanderplayerresults) {
    // If there is no player of that username, send them the Player Not Found screen.
    if (typeof(zanderplayerresults[0]) == "undefined") {
      res.render('errorviews/playernotfound', {
        "pagetitle": "Player Not Found"
      });
      return
    } else {
      if (zanderplayerresults[0].username.includes("*")) {
        bedrockuser = true;
      } else {
        bedrockuser = false;
      };
    }

    // Get the players Mixed TGM statistics to display.
    let response = await fetch(`${process.env.tgmapiurl}/mc/player/${req.params.username}?simple=true`);
    let tgmbodyres = await response.json();
    if (tgmbodyres['notFound']) {
      tgmresbool = false;

      res.render('errorviews/500', {
        "pagetitle": "500: Internal Server Error"
      });
      return
    } else {
      tgmresbool = true;
    }

    const killdeathratio = tgmbodyres.user.kills !== 0 && tgmbodyres.user.deaths !== 0 ? (tgmbodyres.user.kills / tgmbodyres.user.deaths).toFixed(2) : 'None';
    const winlossratio = (tgmbodyres.user.wins / tgmbodyres.user.losses).toFixed(2);

    // Formatting the initial join date and putting it into template.
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const initjoin = zanderplayerresults[0].joined;
    const initjoindate = `${initjoin.getDay()} ${months[initjoin.getMonth()]} ${initjoin.getFullYear()}`;

    if (err) {
      res.render('errorviews/500', {
        "pagetitle": "500: Internal Server Error"
      });
      return;
      throw err;
    } else {
      const reqplayeruuid = zanderplayerresults[0].uuid.replace(/-/g, '');

      // Query the database for the players data and online status.
      let sql = `select id, name, reason, operator, punishmentType from punishmenthistory where uuid = '${reqplayeruuid}';`

      abdatabase.query (sql, async function (err, punishmentresults) {
        if (err) {
          res.render('errorviews/500', {
            "pagetitle": "500: Internal Server Error"
          });
          return;
          throw err;
        } else {
          // Query the database for the players data and online status.
          let sql = `select permission from luckperms_user_permissions where uuid = '${zanderplayerresults[0].uuid}';`

          lpdatabase.query (sql, async function (err, playerrankresults) {
            if (err) {
              res.render('errorviews/500', {
                "pagetitle": "500: Internal Server Error"
              });
              return;
              throw err;
            } else {
              playerrankresults.forEach(function (data) {
                console.log(data.permission);
              });

              res.render('profile', {
                "pagetitle": `${zanderplayerresults[0].username}'s Profile`,
                zanderplayerobjdata: zanderplayerresults,
                punishmentobjdata: punishmentresults,
                playerrankresults: playerrankresults,
                HexColour: HexColour,
                tgmres: tgmbodyres,
                tgmresboolean: tgmresbool,
                bedrockuser: bedrockuser,
                currentserver: capitalizeFirstLetter(zanderplayerresults[0].server),
                initjoindate: initjoindate,
                killdeathratio: killdeathratio,
                winlossratio: winlossratio
              });
            }
          });
        }
      });
    }
  });
});

// Ensure this is the final route on app.js or this will overwrite every route.
app.get('*', function(req, res) {
  res.render('errorviews/404', {
    "pagetitle": "404: Page Not Found"
  });
});

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
// Read all commands in.
//
// General
//
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
  });
});

//
// Moderation
//
fs.readdir('./discord/commands/moderation', (err, files) => {
  if (err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === 'js')
  if (jsfile.length <= 0) {
    console.log('Couldn\'t find commands.');
    return
  }

  jsfile.forEach((files, i) => {
    let props = require(`./discord/commands/moderation/${files}`);
    console.log(`[CONSOLE] [DISCORD] ${files} has been loaded.`);
    client.commands.set(props.help.name, props);
  });
});

//
// Stats
//
fs.readdir('./discord/commands/stats', (err, files) => {
  if (err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === 'js')
  if (jsfile.length <= 0) {
    console.log('Couldn\'t find commands.');
    return
  }

  jsfile.forEach((files, i) => {
    let props = require(`./discord/commands/stats/${files}`);
    console.log(`[CONSOLE] [DISCORD] ${files} has been loaded.`);
    client.commands.set(props.help.name, props);
  });
});

//
// Message Handler
//
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
  console.log(`\n// ${package.name} v.${package.version}\nGitHub Repository: ${package.homepage}\nCreated By: ${package.author}`);
  console.log(`[CONSOLE] Application is listening to the port ${port}`);

  client.login(process.env.discordapitoken);

  client.on("ready", () => {
    console.log('[CONSOLE] [DISCORD] Launched Discord web side.');
  });
});
