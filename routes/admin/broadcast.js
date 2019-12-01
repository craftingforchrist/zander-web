const express = require('express');
const router = express.Router();
const config = require('../../config.json');
const database = require('../../controllers/database.js');
const broadcast = require('../../functions/broadcast');

router.get('/', (req, res, next) => {
  if(req.session.user){
  res.render('admin/broadcast', {
    "pagetitle": "Administration Panel - Broadcast"
  });
  }
  else{
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
    const message = req.body.message;

    //
    // Broadcast
    //
    if (action === "broadcast") {
      if (method === "discord") {
        broadcast.discord(message);
      }
      ;
      res.redirect('/admin/broadcast');
    }
  }
  else{
    res.render('session/login', {
      setValue: true,
      message: 'You cannot access this page unless you are logged in.',
      "pagetitle": "Login"
    });
  }
});

module.exports = router;
