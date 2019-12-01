const express = require('express');
const router = express.Router();
const config = require('../../config.json');
const database = require('../../controllers/database');
const rcon = require('../../controllers/rcon');

router.get('/', (req, res, next) => {
  if(req.session.user) {
    res.render('admin/whitelist', {
      "pagetitle": "Administration Panel - Whitelist"
    });
  }
  else {
    res.render('session/login', {
      setValue: true,
      message: 'You cannot access this page unless you are logged in.',
      "pagetitle": "Login"
    });
  }
});

router.post('/', function (req, res) {
  if(req.session.user) {
    const action = req.body.action;
    const method = req.body.method;
    const username = req.body.username;

    //
    // Whitelist
    //
    if (action === "whitelist") {
      if (method === "add") {
        whitelist.add(username);
      } else if (method === "remove") {
        whitelist.remove(username);
      }
      ;
      res.redirect('/admin/whitelist');
    }
    ;
  }
  else {
    res.render('session/login', {
      setValue: true,
      message: 'You cannot access this page unless you are logged in.',
      "pagetitle": "Login"
    });
  }
});

module.exports = router;
