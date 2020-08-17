const express = require('express');
const router = express.Router();
const config = require('../config.json');
const fetchUrl = require("fetch").fetchUrl

router.get('/', (req, res, next) => {
  res.send('Working on page still, GitHub API go bruh.');

  fetchUrl("https://api.github.com/repos/craftingforchrist/Maps/contributors", function (error, meta, body) {
    headers: {
      Authorization: `token ${process.env.githubuserapitoken}`
    }

    console.log(`\n\n${body}\n\n\n\n${error}`);
  });

  // const url = 'https://api.github.com/repos/craftingforchrist/Maps'
  // const headers = {
  //   Authorization: `token ${process.env.githubuserapitoken}`
  // }
  // const response = fetchUrl(url, {
  //   "method": "GET",
  //   "headers": headers
  // });
  // const result = response.json();
  //
  // console.log(result);

});

module.exports = router;
