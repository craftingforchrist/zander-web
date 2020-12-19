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

// Issue Tracker
router.get('/issues', (req, res, next) => {
  res.redirect(`${config.githubissuetrackerlink}`);
});

// Shop
router.get('/shop', (req, res, next) => {
  res.redirect(`${config.shoplink}`);
});

// Guides
router.get('/guides', (req, res, next) => {
  res.redirect(`${config.guideslink}`);
});

// Feedback
router.get('/feedback', (req, res, next) => {
  res.redirect(`${config.feedbacklink}`);
});

module.exports = router;
