const express = require('express');
const router = express.Router();
const config = require('../../../config.json');
const database = require('../../../controllers/database.js');

function authentication() {
	return (req, res, next) => {
    if (req.isAuthenticated()) return next();
	  res.redirect('/login');
	}
};

router.get('/', authentication(), function(req, res, next) {
  res.render('admin/news/create', {
    "pagetitle": "Admin - Create New News Article"
  });
});

module.exports = router;
