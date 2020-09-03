const { Router } = require('express');
const router = Router();
const config = require('../config.json');

// Discord
router.get('/discord', (req, res, next) => {
  res.redirect(`${config.discordlink}`);
});

// Forums
router.get('/forums', (req, res, next) => {
  res.redirect(config.forumlink);
});

// Sign Up GET
router.get('/issues', (req, res, next) => {
  res.redirect(`${config.githubissuetrackerlink}`);
});

// Sign Up POST
router.get('/shop', (req, res, next) => {
  res.redirect(`${config.shoplink}`);
});

module.exports = router;
