const express = require('express');
const router = express.Router();
const config = require('../../config.json');

router.get('/', (req, res, next) => {
  if (config.builderapp == false) {
    res.redirect("/apply");
  } else {
    res.redirect(`${config.builderapplink}`);
  };


});

module.exports = router;
