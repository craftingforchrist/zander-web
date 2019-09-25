const express = require('express');
const router = express.Router();
const config = require('../../config.json');
const database = require('../../controllers/database.js');

router.get('/', function(req, res, next) {
  res.render('admin/admin', {
    "pagetitle": "Administration Panel"
  });
});

router.post('/', function (req, res) {
  console.log(req.body);
});

module.exports = router;
