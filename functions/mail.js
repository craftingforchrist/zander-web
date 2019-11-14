const transporter = require('../controllers/mail');
const config = require('../config.json');
const ejs = require('ejs');
const path = require('path');

function applyconfirmmail(email, username, subject) {
  ejs.renderFile(path.join(__dirname + "../../views/email/apply/apply-confirmation.ejs"), {
    subject: subject,
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
          }
      });
    }
  });
};

function applyacceptmail(email, username, subject) {
  ejs.renderFile(path.join(__dirname + "../../views/email/apply/apply-accept.ejs"), {
    subject: subject,
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
          }
      });
    }
  });
};

module.exports = {
  applyconfirmmail,
  applyacceptmail
};
