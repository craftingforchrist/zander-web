const database = require('./database'); // zander Database controller
const transporter = require('./mail');
const config = require('../config.json');
const ejs = require('ejs');
const path = require('path');
const randomToken = require('random-token').create('abcdefghijklmnopqrstuvwxzyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
const bcrypt = require('bcrypt');

//
// Login
// GET
//
module.exports.login_get = (req, res) => {
  res.render('session/login', {
    "pagetitle": "Login"
  });
};

//
// Login
// POST
//
module.exports.login_post = (req, res) => {
  res.send('new login');
};

//
// Register
// GET
//
module.exports.register_get = (req, res) => {
  res.render('session/register', {
    "pagetitle": "Register",
    "success": null,
    "error": false
  });
};

//
// Register
// POST
//
module.exports.register_post = (req, res) => {
  const { username, email, password, passwordconfirm } = req.body;

  // Check if the player has logged into the Network.
  let sql = `select username from playerdata where username = ? limit 1;`
  database.query (sql, [`${username}`], function (err, results) {
    if (typeof(results[0]) == "undefined") {
      res.render('session/register', {
        "pagetitle": "Register",
        "success": null,
        "error": true,
        "errormsg": `This player has not logged into the Network, please login and try again.`
      });
      return;
    } else {
      // Check if the passwords match.
      if (password != passwordconfirm) {
        res.render('session/register', {
          "pagetitle": "Register",
          "success": null,
          "error": true,
          "errormsg": "The password you have entered does not match, please try again."
        });
        return;
      } else {
        const saltRounds = process.env.saltRounds;
        const token = randomToken(32);

        bcrypt.genSalt(saltRounds, function(err, salt) {
          bcrypt.hash(password, salt, function (err, hash) {
              // Store hash in your password DB.

              console.log(err);
              console.log(salt);
              console.log(hash);


              // Start the registration linking process and put token into table.
              // database.query (`insert into webaccounts (playerid, email, password, registrationtoken) values ((select id from playerdata where username = ?), ?, ?, ?);`, [`${args[0]}`, `${email}`, `${password}`, `${token}`], function (err, results) {
              //   if (err) {
              //     throw err;
              //   } else {
              //     // Registration email is sent to the user with their link code.
              //     ejs.renderFile(path.join(__dirname, "../views/email/session/registerconfirmtoken.ejs"), {
              //       username: username,
              //       serverip: config.serverip
              //     }, function (err, data) {
              //       if (err) {
              //         console.log(err);
              //       } else {
              //         var mainOptions = {
              //           from: process.env.serviceauthuser,
              //           to: email,
              //           subject: `Registration Confirmation`,
              //           html: data
              //         };
              //
              //         transporter.sendMail(mainOptions, function (err, info) {
              //             if (err) {
              //               console.log(err);
              //             } else {
              //               console.log('Message sent: ' + info.response);
              //
              //               res.render('session/register', {
              //                 "pagetitle": "Register",
              //                 "success": true,
              //                 "error": false,
              //                 "successmsg": `An email is now heading your way with instructions of what to do next!`
              //               });
              //             }
              //         });
              //       }
              //     });
              //   }
              // });
              // return;
          });
        });
      };
    };
  });
};
