const { Router } = require('express');
const router = Router();
const config = require('../config.json');

// Application Page
router.get('/apply', (req, res, next) => {
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

// Junior Staff
router.get('/apply/juniorstaff', (req, res, next) => {
  if (config.juniorstaffapp == false) {
    res.redirect("/apply");
  } else {
    res.redirect(`${config.juniorstaffapplink}`);
  };
});

// Builder
router.get('/apply/builder', (req, res, next) => {
  if (config.builderapp == false) {
    res.redirect("/apply");
  } else {
    res.redirect(`${config.builderapplink}`);
  };
});

// Content Creator
router.get('/apply/creator', (req, res, next) => {
  if (config.contentcreatorapp == false) {
    res.redirect("/apply");
  } else {
    res.redirect(`${config.contentcreatorapplink}`);
  };
});

// Developer
router.get('/apply/developer', (req, res, next) => {
  if (config.developerapp == false) {
    res.redirect("/apply");
  } else {
    res.redirect(`${config.developerapplink}`);
  };
});

// Social Media
router.get('/apply/socialmedia', (req, res, next) => {
  if (config.socialmediaapp == false) {
    res.redirect("/apply");
  } else {
    res.redirect(`${config.socialmediaapplink}`);
  };
});

module.exports = router;
