const express = require('express');
const router = express.Router();
const config = require('../../../config.json');
const database = require('../../../controllers/database.js');
const { ensureAuthenticated } = require('../../../controllers/auth.js');
const minecraftapi = require("minecraft-lib");

router.get('/', ensureAuthenticated, function(req, res, next) {
  database.query('SELECT * FROM news WHERE id=?', [req.query.id], function (err, results, fields) {
    res.render('admin/news/edit', {
      pagetitle: "Admin - Edit an Article",
      results: results[0]
    });
  });
});

router.post('/', ensureAuthenticated, function (req, res, next) {
  const id = req.body.id;
	const title = req.body.title;
	const author = req.body.author;
	const content = req.body.content;

  minecraftapi.players.get(req.body.author).then(player => {
    const authoruuid = player.uuid;

    database.query(`UPDATE news SET title=?, author=?, authoruuid=?, content=? WHERE id=?;`, [title, author, authoruuid, content, id], function (err, results, fields) {
      if (err) {
        throw err;
      };

      res.redirect('/admin/news/list');
    });
    console.log('Edited News Article.');

  }).catch(console.error);

});

module.exports = router;
