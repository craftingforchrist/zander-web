const express = require('express');
const router = express.Router();
const config = require('../../config.json');

router.get('/', (req, res, next) => {
  res.render('policies/terms', {
    "pagetitle": "Terms of Service"
  });
});

module.exports = router;
