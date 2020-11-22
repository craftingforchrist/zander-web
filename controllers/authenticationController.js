// const database = require('./database'); // zander Database controller
// const transporter = require('./mail');
// const config = require('../config.json');
// const ejs = require('ejs');
// const path = require('path');
// const randomToken = require('random-token').create('abcdefghijklmnopqrstuvwxzyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
// const bcrypt = require('bcrypt');
//
// //
// // Login
// // GET
// //
// module.exports.login_get = (req, res) => {
//   res.render('session/login', {
//     "pagetitle": "Login"
//   });
// };
//
// //
// // Login
// // POST
// //
// module.exports.login_post = (req, res) => {
//   res.send('new login');
// };
//
// //
// // Register
// // GET
// //
// module.exports.register_get = (req, res) => {
//   res.render('session/register', {
//     "pagetitle": "Register",
//     "success": null,
//     "error": false
//   });
// };
//
// //
// // Register
// // POST
// //
// module.exports.register_post = (req, res) => {
//   const { username, email, password, passwordconfirm } = req.body;
//
//   console.log(req.body);
//
//   // Check if the player has logged into the Network.
//   let sql = `select * from playerdata where username = ? limit 1;
//   select * from webaccounts where playerid = (select id from playerdata where username = ?) limit 1;`
//   database.query (sql, [`${username}`, `${username}`], async function (err, results) {
//
//     console.log(results);
//
//     // Check if the user has already started registering.
//     if (password != passwordconfirm) {
//       // Check if the passwords match.
//       res.render('session/register', {
//         "pagetitle": "Register",
//         "success": null,
//         "error": true,
//         "errormsg": "The password you have entered does not match, please try again."
//       });
//       return;
//     } else if (!results[0]) {
//       res.render('session/register', {
//         "pagetitle": "Register",
//         "success": null,
//         "error": true,
//         "errormsg": `You have not logged into the Network, please login and try again.`
//       });
//     } else if (results[1].length < 0) {
//         res.render('session/register', {
//           "pagetitle": "Register",
//           "success": null,
//           "error": true,
//           "errormsg": "You are already registered or have started registration."
//         });
//         return;
//     } else {
//         // Hash the password
//         const salt = await bcrypt.genSalt();
//         hashpassword = await bcrypt.hash(password, salt);
//         // Generate a verifation token
//         const token = randomToken(32);
//
//         // Start the registration linking process and put token into table.
//         database.query (`insert into webaccounts (playerid, email, password, registrationtoken) values ((select id from playerdata where username = ?), ?, ?, ?);`, [`${username}`, `${email}`, `${hashpassword}`, `${token}`], function (err, results) {
//           if (err) {
//             throw err;
//             res.render('errorviews/500', {
//               "pagetitle": "500: Internal Server Error"
//             });
//             return;
//           } else {
//             // Registration email is sent to the user with their link code.
//             ejs.renderFile(path.join(__dirname, "../views/email/session/registerconfirmtoken.ejs"), {
//               username: username,
//               token: token,
//               serverip: config.serverip,
//               discordlink: config.discordlink,
//               contactemail: config.contactemail,
//               githubissuetrackerlink: config.githubissuetrackerlink,
//             }, function (err, data) {
//               if (err) {
//                 console.log(err);
//                 res.render('errorviews/500', {
//                   "pagetitle": "500: Internal Server Error"
//                 });
//                 return;
//               } else {
//                 var mainOptions = {
//                   from: process.env.serviceauthuser,
//                   to: email,
//                   subject: `Registration Confirmation`,
//                   html: data
//                 };
//
//                 transporter.sendMail(mainOptions, function (err, info) {
//                     if (err) {
//                       console.log(err);
//                       res.render('errorviews/500', {
//                         "pagetitle": "500: Internal Server Error"
//                       });
//                       return;
//                     } else {
//                       console.log('Message sent: ' + info.response);
//                       res.render('session/register', {
//                         "pagetitle": "Register",
//                         "success": true,
//                         "error": false,
//                         "successmsg": `An email is now heading your way with instructions of what to do next!`
//                       });
//                       transport.close();
//                       return;
//                     }
//                 });
//               }
//             });
//           }
//         });
//         return;
//       };
//   });
// };
