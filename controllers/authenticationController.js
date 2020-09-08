const database = require('./database'); // zander Database controller
const transporter = require('./mail');
const ejs = require('ejs');
const path = require('path');

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
    if (err) {
      throw err;
    } else {
      // If the player is not in the database and has not logged into the Network, send a error message.
      if (typeof(results[0]) == "undefined") {
        res.render('session/register', {
          "pagetitle": "Register",
          "success": null,
          "error": true,
          "errormsg": `This player has not logged into the Network, please login and try again.`
        });
        return;
      };

      // Check if the passwords match.
      if (!password === passwordconfirm) {
        res.render('session/register', {
          "pagetitle": "Register",
          "success": null,
          "error": true,
          "errormsg": "The password you have entered does not match, please try again."
        });
        return;
      }

      ejs.renderFile(path.join(__dirname, "../views/email/session/registerconfimtoken.ejs"), {
        subject: `Registration Confirmation`,
        username: username
      }, function (err, data) {
        if (err) {
          console.log(err);
        } else {
          var mainOptions = {
            from: process.env.serviceauthuser,
            to: email,
            subject: subject,
            html: data
          };

          transporter.sendMail(mainOptions, function (err, info) {
              if (err) {
                console.log(err);
              } else {
                console.log('Message sent: ' + info.response);

                res.render('session/register', {
                  "pagetitle": "Register",
                  "success": true,
                  "error": false,
                  "successmsg": `An email is now heading your way with instructions of what to do next!`
                });
              }
          });
        }
      });
    };
  });

    console.log(req.body);
};
