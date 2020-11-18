const express = require('express');
const router = express.Router();
const config = require('../config.json');
const database = require('../controllers/database.js');

router.get('/', (req, res, next) => {
  // database.query (`SELECT * FROM events ORDER BY id DESC;`, function (error, results, fields) {
  //   if (error) {
  //     res.redirect('/');
  //     throw error;
  //   } else {
  //     res.render('events', {
  //       "pagetitle": "Events",
  //       objdata: results
  //     });
  //   };
  // });

  // yt.get(process.env.ytapikey, 'JackSucksAtMinecraft') // Only Channel ID, User ID not supported
  //   .then((videos) => {
	//     console.log(videos)
	// })
	// .catch((err) => {
	// 	console.log(err)
	// })

  ypi.channelVideos(process.env.ytapikey, 'UC53F4RZCQMcRxu2dskj16Yw', function(channelItems) {
    console.log(channelItems);
  });


  res.render('500', {
    "pagetitle": "Watch"
  });
});

module.exports = router;
