const express = require('express');
const router = express.Router();
const config = require('../../../../config.json');
const lpdatabase = require('../../../../controllers/lpdatabase.js');

router.get('/', (req, res, next) => {
  if (req.session.user) {
    lpdatabase.query(`SELECT uuid, (SELECT username FROM luckperms_players WHERE luckperms_players.uuid = luckperms_user_permissions.uuid) as username, permission, title FROM luckperms_user_permissions WHERE permission LIKE 'group.%' AND permission != 'group.default'`, function (error, results, fields) {
      if (error) {
        throw error;
        res.render('errorviews/500', {
          "pagetitle": "500: Internal Server Error"
        });
        return;
      } else {
        res.render('admin/staff/title/list', {
          "pagetitle": "Administration Panel - Staff Title",
          objdata: results
        });
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

router.post('/', function (req, res) {
  if (req.session.user) {
    const action = req.body.action;
    const uuid = req.body.uuid;
    const username = req.body.username;
    const permission = req.body.permission;
    const title = req.body.title;

    if (action == 'edit') {
      res.render('admin/staff/title/edit', {
        "pagetitle": "Staff Title Edit",
        uuid: uuid,
        username: username,
        permission: permission,
        title: title
      });
    };

    if (action == 'remove') {
      lpdatabase.query(`UPDATE luckperms_user_permissions SET title = ? WHERE uuid = ? AND permission = ?;`, ["", uuid, permission], function (error, results, fields) {
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
    };
  } else {
    res.render('session/login', {
      setValue: true,
      message: 'You cannot access this page unless you are logged in.',
      "pagetitle": "Login"
    });
  }
});

module.exports = router;
