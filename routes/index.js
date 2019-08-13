const express = require('express');
const router = express.Router();
const config = require('../config.json');

router.get('/', (req, res, next) => {
  res.render('index', {
    "servername": `${config.servername}`,
    "sitecolour": `${config.sitecolour}`,
    "email": `${config.email}`,
    "serverip": `${config.serverip}`,
    "website": `${config.website}`,
    "description": `${config.description}`,
    "weblogo": `${config.weblogo}`,
    "webvideobackground": `${config.webvideobackground}`,
    "webfavicon": `${config.webfavicon}`,
    "pagetitle": "Home"
  });
});

module.exports = router;
