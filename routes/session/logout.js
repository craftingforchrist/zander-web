const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  req.logout();
  req.flash('successmsg', 'You have been logged out.');
  res.redirect('/');
});

module.exports = router;
