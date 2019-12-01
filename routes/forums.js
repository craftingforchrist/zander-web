const express = require('express');
const router = express.Router();
const config = require('../config.json');

router.get('/', (req, res, next) => {
  if(req.session.user){
    res.locals.info = true;
  }
  else{
    res.locals.info = false;
  }
  res.redirect(config.forumlink);
});

module.exports = router;
