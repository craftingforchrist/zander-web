const express = require('express');
const router = express.Router();
const config = require('../../../config.json');
const database = require('../../../controllers/database.js');

router.post('/', function (req, res) {
  if (req.session.user) {
    const action = req.body.action;
    const id = req.body.id;

    database.query(`DELETE FROM servers WHERE id = ?`, [id], function (error, results, fields) {
      if (error) {
        throw error;
        res.render('errorviews/500', {
          "pagetitle": "500: Internal Server Error"
        });
        return;
      } else {
        res.redirect('/admin/servers');
      };
    });
  } else {
    res.render('session/login', {
      setValue: true,
      message: 'You cannot access this page unless you are logged in.',
      "pagetitle": "Login"
    });
  }
});

module.exports = router;
