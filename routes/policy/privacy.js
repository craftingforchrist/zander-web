const express = require('express');
const router = express.Router();
const config = require('../../config.json');

router.get('/', (req, res, next) => {
  res.render('policies/privacy', {
    "servername": `${config.servername}`,
    "sitecolour": `${config.sitecolour}`,
    "email": `${config.email}`,
    "serverip": `${config.serverip}`,
    "website": `${config.website}`,
    "description": `${config.description}`,
    "weblogo": `${config.weblogo}`,
    "webfavicon": `${config.webfavicon}`,
    "pagetitle": "Privacy Policy",
    privacymd: config.privacymd
  });
});

module.exports = router;
