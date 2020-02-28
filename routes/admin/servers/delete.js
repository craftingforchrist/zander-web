const express = require('express');
const router = express.Router();
const config = require('../../../config.json');
const database = require('../../../controllers/database.js');

router.post('/', function (req, res) {
  if (req.session.user) {
    const action = req.body.action;
    const id = req.body.id;

    if (action == 'delete') {
      database.query(`DELETE FROM servers WHERE id = ?`, [id], function (error, results, fields) {
        if (error) {
          res.redirect('/');
          throw error;
        } else {
          res.redirect('/admin/servers');
        };
      });
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
