const express = require('express');
const router = express.Router();
const session = require('express-session');

router.get('/', function(req, res, next) {
  req.flash('successmsg', 'You have been logged out.');
  req.session.destroy();
  res.render('errorviews/500', {
    "pagetitle": "500: Internal Server Error"
  });
  return;

  // res.render('index', {
  //   "pagetitle": "Home",
  //   successalert: true,
  //   message: "You have been successfully logged out."
  // });
});

module.exports = router;
