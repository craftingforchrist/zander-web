const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  req.flash('successmsg', 'You have been logged out.');
  req.session.destroy()
  res.redirect('/');
});

module.exports = router;
