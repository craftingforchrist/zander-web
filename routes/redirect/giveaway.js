const express = require('express');
const router = express.Router();
const config = require('../../config.json');

router.get('/', (req, res, next) => {
  res.redirect(`https://gleam.io/competitions/hgxXq-crafting-for-christ-minecraft-dungeons-standard-edition-giveaway`);
});

module.exports = router;
