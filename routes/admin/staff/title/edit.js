const express = require('express');
const router = express.Router();
const config = require('../../../../config.json');
const lpdatabase = require('../../../../controllers/lpdatabase.js');

router.get('/', (req, res, next) => {
  if (!req.session.user) {
    res.render('session/login', {
      setValue: true,
      message: 'You cannot access this page unless you are logged in.',
      "pagetitle": "Login"
    });
}});

router.post('/', function (req, res) {
  if (req.session.user) {
    const uuid = req.body.uuid;
    const username = req.body.username;
    const permission = req.body.permission;
    const oldtile = req.body.oldtile;
    const newtitle = req.body.newtitle;

    lpdatabase.query(`UPDATE luckperms_user_permissions SET title = ? WHERE uuid = ? AND permission = ?;`, [newtitle, uuid, permission], function (error, results, fields) {
      if (error) {
        throw error;
        res.render('errorviews/500', {
          "pagetitle": "500: Internal Server Error"
        });
        return;
      } else {
        res.redirect('/admin/staff/title');
      }
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
