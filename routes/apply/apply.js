const express = require('express');
const router = express.Router();
const config = require('../../config.json');

router.get('/', (req, res, next) => {
  res.render('apply/apply', {
    "pagetitle": "Apply",
    errors: req.flash('error')
  });
});

module.exports = router;
