const express = require('express');
const router = express.Router();
const config = require('../../config.json');
const database = require('../../controllers/database');
const applystatus = require('../../functions/apply/applystatus');

router.get('/', (req, res, next) => {
  if(req.session.user) {
    database.query(`SELECT * FROM gameapplications WHERE appstatus='PROCESSING';`, function (error, results, fields) {
      if (error) {
        res.redirect('/');
        throw error;
      } else {
        res.render('admin/application', {
          "pagetitle": "Administration Panel - Applications",
          objdata: results
        });
      }
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
    const id = req.body.id;

    //
    // Application
    //
    if (action === "applyaccept") {
      applystatus.accept(id, req, res);
    }
    ;

    if (action === "applydeny") {
      applystatus.deny(id, req, res);
    }
    ;
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
