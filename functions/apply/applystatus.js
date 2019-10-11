const database = require('../../controllers/database');
const whitelist = require('../../functions/whitelist');

//
// Game Application Accept
//
function accept(id, req, res) {
  database.query (`UPDATE gameapplications SET appstatus='ACCEPTED' WHERE id=?`, [req.body.id], function (error, results, fields) {
    if (error) {
      throw error;
    } else {
      whitelist.add(req.body.username);
      res.redirect('/admin');
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
      res.redirect('/admin');
    }
  });
};

module.exports = {
  accept,
  deny
};
