const express = require('express');
const router = express.Router();
const config = require('../../config.json');

router.get('/', (req, res, next) => {
  res.render('policies/rules', {
    "servername": `${config.servername}`,
    "sitecolour": `${config.sitecolour}`,
    "email": `${config.email}`,
    "serverip": `${config.serverip}`,
    "website": `${config.website}`,
    "description": `${config.description}`,
    "weblogo": `${config.weblogo}`,
    "webfavicon": `${config.webfavicon}`,
    "pagetitle": "Rules",
    rulesmd: config.rulesmd
  });
});

module.exports = router;
