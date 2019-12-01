const express = require('express');
const router = express.Router();
const config = require('../../config.json');

router.get('/', (req, res, next) => {
  if (req.session.user) {
    res.locals.info = true;
  } else {
    res.locals.info = false;
  }

  res.render('apply/apply', {
    "pagetitle": "Apply",
    successalert: null,
    erroralert: null,
    message: null,
    errors: req.flash('error'),
    developerapp: config.developerapp,
    contentcreatorapp: config.contentcreatorapp,
    gameserverapp: config.gameserverapp,
    juniorstaffapp: config.juniorstaffapp,
    socialmediaapp: config.socialmediaapp
  });
});

module.exports = router;
