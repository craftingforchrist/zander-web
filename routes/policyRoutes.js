const { Router } = require('express');
const router = Router();

// Terms of Service
router.get('/terms', (req, res, next) => {
  res.render('policies/terms', {
    "pagetitle": "Terms Of Service"
  });
});

// Privacy
router.get('/privacy', (req, res, next) => {
  res.render('policies/privacy', {
    "pagetitle": "Privacy Policy"
  });
});

// Rules
router.get('/rules', (req, res, next) => {
  res.render('policies/rules', {
    "pagetitle": "Rules"
  });
});

// Refund
router.get('/refund', (req, res, next) => {
  res.render('policies/refund', {
    "pagetitle": "Refund Policy"
  });
});

module.exports = router;
