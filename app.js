//
// Project Dependencies
//
const express = require('express');
const session = require('express-session');
const fs = require('fs');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const mysql = require('mysql');
const ejs = require('ejs');
const package = require('./package.json');
const config = require('./config.json');
const credentials = require('./credentials.json');
const request = require('request');

const Discord = require('discord.js');
const client = new Discord.Client({ disableEveryone: true });
client.commands = new Discord.Collection();

const nodemailer = require('nodemailer');
const inlinecss = require('nodemailer-juice');

//
// Mailer Controller
//
var transporter = nodemailer.createTransport({
  host: process.env.servicehost || credentials.servicehost,
  port: process.env.serviceport || credentials.serviceport,
  secure: true,
  auth: {
    user: process.env.serviceauthuser || credentials.serviceauthuser,
    pass: process.env.serviceauthpass || credentials.serviceauthpass
  }
});
transporter.use('compile', inlinecss());

//
// Constants
//
const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
var obj = {};

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static('./public'));
// app.use(session({
//   name: 'sid',
//   resave: false,
//   saveUninitalized: false,
//   secret: "LktTVKER2z_9$b[<",
//   cookie: {
//     maxAge: 3600000,
//     sameSite: true,
//     secure: true
//   }
// }));

//
// Site Routes
//
var index = require('./routes/index');
var apply = require('./routes/apply/apply');
var terms = require('./routes/policy/terms');
var privacy = require('./routes/policy/privacy');
var rules = require('./routes/policy/rules');
var discord = require('./routes/redirect/discord');
var donate = require('./routes/redirect/donate');
var issues = require('./routes/redirect/issues');
var store = require('./routes/redirect/store');
var support = require('./routes/redirect/support');
var applygame = require('./routes/apply/apply-game');
var applycreator = require('./routes/apply/apply-creator');
var applydeveloper = require('./routes/apply/apply-developer');
var report = require('./routes/report');
var contact = require('./routes/contact');

app.use('/', index);
app.use('/apply', apply);
app.use('/terms', terms);
app.use('/privacy', privacy);
app.use('/rules', rules);
app.use('/discord', discord);
app.use('/donate', donate);
app.use('/issues', issues);
app.use('/store', store);
app.use('/support', support);
app.use('/apply/game', applygame);
app.use('/apply/creator', applycreator);
app.use('/apply/developer', applydeveloper);
app.use('/report', report);
app.use('/contact', contact);

//
// Database Controller
//
const connection = mysql.createConnection({
  host: process.env.dbhost || credentials.dbhost,
  user: process.env.dbuser || credentials.dbuser,
  password: process.env.dbpassword || credentials.dbpassword,
  database: process.env.dbdatabase || credentials.dbdatabase,
  multipleStatements: true
});

connection.connect(function(err) {
  if (err) {
    console.error(chalk.red('[ERROR] ') + chalk.blue('[DB] ') +  'There was an error connecting:\n' + err.stack);
    return;
  }
  console.log(chalk.yellow('[CONSOLE] ' ) + chalk.blue('[DB] ') + 'Database connection is successful. Your connection ID is ' + connection.threadId + '.');
});

// //
// // Login
// //
// app.get('/login', function (req, res) {
//   res.render('session/login', {
//     "servername": `${config.servername}`,
//     "sitecolour": `${config.sitecolour}`,
//     "email": `${config.email}`,
//     "serverip": `${config.serverip}`,
//     "website": `${config.website}`,
//     "description": `${config.description}`,
//     "weblogo": `${config.weblogo}`,
//     "webfavicon": `${config.webfavicon}`,
//     "pagetitle": "Login"
//   });
// });
//
// app.post('/login', urlencodedParser, function (req, res) {
//
// });
//
// //
// // Register
// //
// app.get('/register', function (req, res) {
//   res.render('session/register', {
//     "servername": `${config.servername}`,
//     "sitecolour": `${config.sitecolour}`,
//     "email": `${config.email}`,
//     "serverip": `${config.serverip}`,
//     "website": `${config.website}`,
//     "description": `${config.description}`,
//     "weblogo": `${config.weblogo}`,
//     "webfavicon": `${config.webfavicon}`,
//     "pagetitle": "Register"
//   });
// });
//
// app.post('/register', urlencodedParser, function (req, res) {
//
// });
//
// //
// // Dashboard
// //
// app.get('/dashboard', function (req, res) {
//   res.render('administration/dashboard', {
//     "servername": `${config.servername}`,
//     "sitecolour": `${config.sitecolour}`,
//     "email": `${config.email}`,
//     "serverip": `${config.serverip}`,
//     "website": `${config.website}`,
//     "description": `${config.description}`,
//     "weblogo": `${config.weblogo}`,
//     "webfavicon": `${config.webfavicon}`,
//     "pagetitle": "Dashboard"
//   });
// });
//
//
// app.post('/logout', urlencodedParser, function (req, res) {
//
// });

//
// Apply [Game]
//
app.post('/apply-game', urlencodedParser, function (req, res) {
  try {
    if (config.discordsend == true) {
      //
      // Discord Notification Send
      // Requires a #whitelist-apps channel to be created.
      //
      let applicationschannel = client.channels.find(c => c.name === 'applications');
      if (!applicationschannel) return console.log('A #applications channel does not exist.');

      var embed = new Discord.RichEmbed()
        .setTitle(`Whitelist Application [${req.body.minecraftUsernameselector}]`)
        .addField(`Username`, `${req.body.minecraftUsernameselector}`, true)
        .addField(`Discord Tag`, `${req.body.discordtagselector}`, true)
        .addField(`How did you hear about us`, `${req.body.howdidyouhearaboutusselector}`)
        .addField(`Any additional information`, `${req.body.additionalinformationselector}`)
        .setColor('#99ddff')
      applicationschannel.send(embed);
      console.log(chalk.yellow('[CONSOLE] ') + chalk.blue('[DISCORD] ') + `Whitelist Application for ${req.body.minecraftUsernameselector} has been sent.`);
    };

    if (config.mailsend == true) {
      //
      // Mail Send
      // Requires a email to be in the notificationemail field.
      //
      ejs.renderFile(__dirname + "/views/email/apply-game.ejs", {
        subject: `[Game Application] ${req.body.minecraftUsernameselector}`,
        username: req.body.minecraftUsernameselector,
        discordtag: req.body.discordtagselector,
        howdidyouhearaboutus: req.body.howdidyouhearaboutusselector,
        additionalinformation: req.body.additionalinformationselector
      }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            var mainOptions = {
                from: process.env.serviceauthuser || credentials.serviceauthuser,
                to: config.notificationemail,
                subject: `[Game Application] ${req.body.minecraftUsernameselector}`,
                html: data
            };

            transporter.sendMail(mainOptions, function (err, info) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Message sent: ' + info.response);
                }
            });
        }
      });
    }

    res.redirect('/');
  } catch (error) {
    console.log('An error occured');
    console.log(error);
  }
});

//
// Apply [Creator]
//
app.post('/apply-creator', urlencodedParser, function (req, res) {
  try {
    if (config.discordsend == true) {
      //
      // Discord Notification Send
      // Requires a #applications channel to be created.
      //
      let applicationsschannel = client.channels.find(c => c.name === 'applications');
      if (!applicationsschannel) return console.log('A #applications channel does not exist.');

      var embed = new Discord.RichEmbed()
        .setTitle(`Content Creator Application [${req.body.minecraftusernameselector}]`)
        .addField(`Username`, `${req.body.minecraftusernameselector}`, true)
        .addField(`Discord Tag`, `${req.body.discordtagselector}`, true)
        .addField(`Content Platform`, `${req.body.contentplatformselector}`)
        .addField(`Channel Link`, `${req.body.channellinkselector}`)
        .addField(`Subscriber Count`, `${req.body.subscribercountselector}`)
        .addField(`Any additional information`, `${req.body.additionalinformationselector}`)
        .setColor('#00ace6')
      applicationsschannel.send(embed);
      console.log(chalk.yellow('[CONSOLE] ') + chalk.blue('[DISCORD] ') + `Content Creator Application for ${req.body.minecraftusernameselector} has been sent.`);
    };

    if (config.mailsend == true) {
      //
      // Mail Send
      // Requires a email to be in the notificationemail field.
      //
      ejs.renderFile(__dirname + "/views/email/apply-creator.ejs", {
        subject: `[Content Creator] ${req.body.minecraftusernameselector}`,
        username: req.body.minecraftusernameselector,
        discordtag: req.body.discordtagselector,
        contentplatform: req.body.contentplatformselector,
        channellink: req.body.channellinkselector,
        subscribercount: req.body.subscribercountselector,
        additionalinformation: req.body.additionalinformationselector
      }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            var mainOptions = {
                from: process.env.serviceauthuser || credentials.serviceauthuser,
                to: config.notificationemail,
                subject: `[Content Creator] ${req.body.minecraftusernameselector}`,
                html: data
            };

            transporter.sendMail(mainOptions, function (err, info) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Message sent: ' + info.response);
                }
            });
        }
      });
    }

    res.redirect('/');
  } catch (error) {
    console.log('An error occured');
    console.log(error);
  }
});

//
// Apply [Developer]
//
app.post('/apply-developer', urlencodedParser, function (req, res) {
  try {
    if (config.discordsend == true) {
      //
      // Discord Notification Send
      // Requires a #applications channel to be created.
      //
      let applicationsschannel = client.channels.find(c => c.name === 'applications');
      if (!applicationsschannel) return console.log('A #applications channel does not exist.');

      var embed = new Discord.RichEmbed()
        .setTitle(`Developer Application [${req.body.nameselector}]`)
        .addField(`Name`, `${req.body.nameselector}`, true)
        .addField(`What is your email address?`, `${req.body.emailselector}`, true)
        .addField(`What is your Discord Tag?`, `${req.body.discordtagselector}`, true)
        .addField(`What experience do you have as a Developer?`, `${req.body.devexperienceselector}`)
        .addField(`Provide links to projects that you have contributed to.`, `${req.body.devcontributeselector}`)
        .addField(`Why are you interested in joining our team?`, `${req.body.interestselector}`)
        .addField(`Why do you think you are the best choice for our team?`, `${req.body.bestchoiceselector}`)
        .addField(`Any other information or comments?`, `${req.body.additionalinformationselector}`)
        .setColor('#d580ff')
      applicationsschannel.send(embed);
      console.log(chalk.yellow('[CONSOLE] ') + chalk.blue('[DISCORD] ') + `Developer Application for ${req.body.nameselector} has been sent.`);
    };

    if (config.mailsend == true) {
      //
      // Mail Send
      // Requires a email to be in the notificationemail field.
      //
      ejs.renderFile(__dirname + "/views/email/apply-developer.ejs", {
        subject: `[Developer] ${req.body.nameselector}`,
        name: req.body.nameselector,
        email: req.body.emailselector,
        discordtag: req.body.discordtagselector,
        devexperience: req.body.devexperienceselector,
        devcontribute: req.body.devcontributeselector,
        interest: req.body.interestselector,
        bestchoice: req.body.bestchoiceselector,
        additionalinformation: req.body.additionalinformationselector
      }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            var mainOptions = {
                from: process.env.serviceauthuser || credentials.serviceauthuser,
                to: config.notificationemail,
                subject: `[Developer] ${req.body.nameselector}`,
                html: data
            };

            transporter.sendMail(mainOptions, function (err, info) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Message sent: ' + info.response);
                }
            });
        }
      });
    }

    res.redirect('/');
  } catch (error) {
    console.log('An error occured');
    console.log(error);
  }
});

//
// Report A Player
//
app.post('/report', urlencodedParser, function (req, res) {
  try {
    if (config.discordsend == true) {
      //
      // Discord Notification Send
      // Requires a #reports channel to be created.
      //
      let reportsschannel = client.channels.find(c => c.name === 'reports');
      if (!reportsschannel) return console.log('A #reports channel does not exist.');

      var embed = new Discord.RichEmbed()
        .setTitle(`Player Report [${req.body.reporteduserselector}]`)
        .addField(`What is your Minecraft Username?`, `${req.body.reporteruserselector}`, true)
        .addField(`What is the Minecraft username of the player you would like to report?`, `${req.body.reporteduserselector}`, true)
        .addField(`Platform`, `${req.body.platformselector}`, true)
        .addField(`Please provide your reasoning for this report with evidence.`, `${req.body.evidenceselector}`)
        .addField(`What is your Discord Tag?`, `${req.body.discordtagselector}`)
        .setColor('#ff8533')
      reportsschannel.send(embed);
      console.log(chalk.yellow('[CONSOLE] ') + chalk.blue('[DISCORD] ') + `Player Report for ${req.body.reporteduserselector} has been sent.`);
    };

    if (config.mailsend == true) {
      //
      // Mail Send
      // Requires a email to be in the notificationemail field.
      //
      ejs.renderFile(__dirname + "/views/email/report.ejs", {
        subject: `[Player Report] ${req.body.reporteduserselector}`,
        reporteduser: req.body.reporteduserselector,
        reporteruser: req.body.reporteruserselector,
        platform: req.body.platformselector,
        evidence: req.body.evidenceselector,
        discordtag: req.body.discordtagselector
      }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            var mainOptions = {
                from: process.env.serviceauthuser || credentials.serviceauthuser,
                to: config.notificationemail,
                subject: `[Player Report] ${req.body.reporteduserselector}`,
                html: data
            };

            transporter.sendMail(mainOptions, function (err, info) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Message sent: ' + info.response);
                }
            });
        }
      });
    }

    res.redirect('/');
  } catch (error) {
    console.log('An error occured');
    console.log(error);
  }
});

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
// Players
//
app.get('/players', function (req, res) {
  connection.query (`SELECT * FROM playerdata; SELECT pd.username as 'username', COUNT(ses.id) as 'joins' FROM sessions ses left join playerdata pd on pd.id = ses.player_id group by pd.username;`, function (error, results, fields) {
    if (error) {
      res.redirect('/');
      throw error;
    } else {
      res.render('players', {
        "servername": `${config.servername}`,
        "sitecolour": `${config.sitecolour}`,
        "email": `${config.email}`,
        "serverip": `${config.serverip}`,
        "website": `${config.website}`,
        "description": `${config.description}`,
        "weblogo": `${config.weblogo}`,
        "webfavicon": `${config.webfavicon}`,
        "pagetitle": "Players",
        objdata: results
      });
      console.log(results);
    }
  });
});

//
// Punishments
//
app.get('/punishments', function (req, res) {
  let sql = `select p.id as 'id', p.punishtimestamp as 'timestamp', punisher.username as 'punisher', punisher.uuid as 'punisheruuid', punished.username as 'punished', punished.uuid as 'punisheduuid', p.punishtype as 'punishtype', p.reason as 'reason' from punishments p left join playerdata punished on punished.id = p.punisheduser_id left join playerdata punisher on punisher.id = p.punisher_id ORDER BY id ASC;`;
  connection.query (sql, function (err, results) {
    if (err) {
      res.redirect('/');
      throw err;
    } else {
      res.render('punishments', {
        "servername": `${config.servername}`,
        "sitecolour": `${config.sitecolour}`,
        "email": `${config.email}`,
        "serverip": `${config.serverip}`,
        "website": `${config.website}`,
        "description": `${config.description}`,
        "weblogo": `${config.weblogo}`,
        "webfavicon": `${config.webfavicon}`,
        "pagetitle": "Punishments",
        objdata: results
      });
      // console.log(results);
    }
  });
});

//
// Profile
//
app.get('/profile/:username', function (req, res) {
  let sql = `SELECT * FROM playerdata WHERE username='${req.params.username}'; select if((select ses.id from sessions ses left join playerdata pd on pd.id = ses.player_id where ses.sessionstart <= NOW() and sessionend is NULL and pd.username = '${req.params.username}'), 'Online', 'Offline') as 'status'; select SEC_TO_TIME(sum(TIME_TO_SEC(timediff(ses.sessionend, ses.sessionstart)))) as 'timeplayed' from sessions ses left join playerdata pd on pd.id = ses.player_id where pd.username = '${req.params.username}'; SELECT count(ses.id) as 'joins' from sessions ses left join playerdata pd on pd.id = ses.player_id where pd.username = '${req.params.username}'; select p.username, timediff(lp.lp_timestamp, NOW()) as 'lastseen' from (select ses.player_id, greatest(max(ses.sessionend), max(ses.sessionstart)) as 'lp_timestamp' from sessions ses group by ses.player_id) as lp left join playerdata p on p.id = lp.player_id where username = '${req.params.username}';`;
  connection.query (sql, function (err, results) {
    if (err) {
      res.redirect('/');
      throw err;
    } else {
      res.render('profile', {
        "servername": `${config.servername}`,
        "sitecolour": `${config.sitecolour}`,
        "email": `${config.email}`,
        "serverip": `${config.serverip}`,
        "website": `${config.website}`,
        "description": `${config.description}`,
        "weblogo": `${config.weblogo}`,
        "webfavicon": `${config.webfavicon}`,
        "pagetitle": `${req.params.username}'s Profile`,
        objdata: results
      });
    }
  });
});

//
// Contact
//
app.post('/contact', urlencodedParser, function (req, res) {
  try {
    if (config.discordsend == true) {
      //
      // Discord Notification Send
      // Requires a #enquiries channel to be created.
      //
      let enquirieschannel = client.channels.find(c => c.name === 'enquiries');
      if (!enquirieschannel) return console.log('A #enquiries channel does not exist.');

      var embed = new Discord.RichEmbed()
        .setTitle(`New Contact Enquiry`)
        .addField(`Username/Name`, `${req.body.name}`, true)
        .addField(`Email`, `${req.body.email}`, true)
        .addField(`Subject`, `${req.body.subject}`)
        .addField(`Message`, `${req.body.message}`)
        .setColor('#86b300')
      enquirieschannel.send(embed);
      console.log(chalk.yellow('[CONSOLE] ') + chalk.blue('[DISCORD] ') + `Enquiry has been sent.`);
    };

    if (config.mailsend == true) {
      //
      // Mail Send
      // Requires a email to be in the notificationemail field.
      //
      ejs.renderFile(__dirname + "/views/email/enquiry.ejs", {
        subject: `[Enquiry] ${req.body.subject}`,
        nameselector: req.body.name,
        emailselector: req.body.email,
        subjectselector: req.body.subject,
        messageselector: req.body.message
      }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            var mainOptions = {
                from: process.env.serviceauthuser || credentials.serviceauthuser,
                to: config.notificationemail,
                subject: `[Enquiry] ${req.body.subject}`,
                html: data
            };

            transporter.sendMail(mainOptions, function (err, info) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Message sent: ' + info.response);
                }
            });
        }
      });
    }
    res.redirect('/');
  } catch (error) {
    console.log('An error occured');
    console.log(error);
  }
});

//
// About
//
// app.get('/about', function (req, res) {
//   res.render('about', {
//     "servername": `${config.servername}`,
//     "sitecolour": `${config.sitecolour}`,
//     "email": `${config.email}`,
//     "serverip": `${config.serverip}`,
//     "website": `${config.website}`,
//     "description": `${config.description}`,
//     "weblogo": `${config.weblogo}`,
//     "webfavicon": `${config.webfavicon}`,
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

  let prefix = '!';
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
app.listen(process.env.PORT || config.applicationlistenport, function() {
  console.log(chalk.yellow(`\n// zander-web v.${package.version}\n`) + chalk.cyan(`GitHub Repository: ${package.homepage}\nCreated By: ${package.author}`));
  console.log(chalk.yellow('[CONSOLE] ' ) + 'Application is listening to the port ' + process.env.PORT || config.applicationlistenport);

  client.login(process.env.token || credentials.token);

  client.on("ready", () => {
    console.log(chalk.yellow('[CONSOLE] ' ) + chalk.blue('[DISCORD] ') + 'Launched Discord web-side.');
  });
});
