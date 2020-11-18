const express = require('express');
const router = express.Router();
const config = require('../../../config.json');
const database = require('../../../controllers/database.js');

router.post('/', function (req, res) {
  if (req.session.user) {
    const action = req.body.action;
    const type = req.body.type;
    const channelname = req.body.channelname;
    const id = req.body.id;

    if (action == 'delete') {
      if (type == 'streamer') {
        database.query(`DELETE FROM ccstreams WHERE id = ?`, [id], function (error, results, fields) {
          if (error) {
            res.render('errorviews/500', {
              "pagetitle": "500: Internal Server Error"
            });
            return;
            throw error;
          } else {
            res.redirect('/admin/contentcreator');
          };
        });
      } else if (type == 'channel') {
        database.query(`DELETE FROM ccvideos WHERE id = ?`, [id], function (error, results, fields) {
          if (error) {
            res.render('errorviews/500', {
              "pagetitle": "500: Internal Server Error"
            });
            return;
            throw error;
          } else {
            res.redirect('/admin/contentcreator');
          };
        });
      }
    }
  } else {
    res.render('session/login', {
      setValue: true,
      message: 'You cannot access this page unless you are logged in.',
      "pagetitle": "Login"
    });
  }
});

module.exports = router;
