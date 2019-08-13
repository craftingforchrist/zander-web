const express = require('express');
const router = express.Router();
const config = require('../../config.json');

router.get('/', (req, res, next) => {
  res.render('apply/apply', {
    "servername": `${config.servername}`,
    "sitecolour": `${config.sitecolour}`,
    "email": `${config.email}`,
    "serverip": `${config.serverip}`,
    "website": `${config.website}`,
    "description": `${config.description}`,
    "weblogo": `${config.weblogo}`,
    "webfavicon": `${config.webfavicon}`,
    developersmd: config.developersmd,
    contentcreatorsmd: config.contentcreatorsmd,
    "pagetitle": "Apply"
  });
});

module.exports = router;
