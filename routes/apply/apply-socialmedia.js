const express = require('express');
const router = express.Router();
const config = require('../../config.json');

router.get('/', (req, res, next) => {
  if (config.socialmediaapp == false) {
    res.redirect("/apply");
  } else {
    res.redirect(`${config.socialmediaapplink}`);
  };


});

module.exports = router;
