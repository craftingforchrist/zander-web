const express = require('express');
const router = express.Router();
const config = require('../../config.json');

router.get('/', (req, res, next) => {
  res.render('giveaway', {
    "pagetitle": "Giveaway"
  });
});

module.exports = router;
