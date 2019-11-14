const database = require('../../controllers/database');
const whitelist = require('../../functions/whitelist');
const mail = require('../../functions/mail');

//
// Game Application Accept
//
function accept(id, req, res) {
  database.query (`SELECT * FROM gameapplications WHERE id=?`, [req.body.id], function (error, results, fields) {
    if (error) {
      throw error;
    } else {
      const email = results[0].email;
      const username = results[0].username;
      const subject = "🎉🎉🎉 Welcome to the Community!";

      mail.applyacceptmail(email, username, subject);

      database.query (`UPDATE gameapplications SET appstatus='ACCEPTED' WHERE id=?`, [req.body.id], function (error, results, fields) {
        if (error) {
          throw error;
        } else {
          whitelist.add(req.body.username);
          res.redirect('/admin/application');
        }
      });
    }
  });
};

//
// Game Application Deny
//
function deny(id, req, res) {
  database.query (`UPDATE gameapplications SET appstatus='DENIED' WHERE id=?`, [req.body.id], function (error, results, fields) {
    if (error) {
      throw error;
    } else {
      res.redirect('/admin/application');
    }
  });
};

module.exports = {
  accept,
  deny
};
