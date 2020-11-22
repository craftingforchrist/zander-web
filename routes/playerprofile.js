const { Router } = require('express');
const router = Router();
const config = require('../config.json');
const database = require('../controllers/database'); // zander Database controller
const abdatabase = require('../controllers/abdatabase'); // AdvancedBan Database controller
const fetch = require('node-fetch');

router.get('/profile/:username', function (req, res) {
  // Query the database for the players data and online status.
  let sql = `select sessionend, sessionstart, uuid, username, joined, server,
  (IF(
  		(select gamesessions.id
  		from gamesessions
  		left join playerdata pd on pd.id = gamesessions.player_id
          where gamesessions.sessionstart <= NOW()
          and gamesessions.sessionend is NULL
          and pd.username = '${req.params.username}'
        ), 'online', 'offline'))  as 'status'
  from gamesessions, playerdata
  where player_id = playerdata.id
  and playerdata.username = '${req.params.username}'
  order by sessionstart desc
  limit 1;`

  database.query (sql, async function (err, zanderplayerresults) {
    // If there is no player of that username, send them the Player Not Found screen.
    if (typeof(zanderplayerresults[0]) == "undefined") {
      res.render('playernotfound', {
        "pagetitle": "Player Not Found"
      });
      return
    } else {
      if (zanderplayerresults[0].username.includes("*")) {
        bedrockuser = true;
      } else {
        bedrockuser = false;
      };
    }

    // Get the players Mixed TGM statistics to display.
    let response = await fetch(`${process.env.tgmapiurl}/mc/player/${req.params.username}?simple=true`);
    let tgmbodyres = await response.json();
    if (tgmbodyres['notFound']) {
      tgmresbool = false;
    } else {
      tgmresbool = true;
    }

    const killdeathratio = tgmbodyres.user.kills !== 0 && tgmbodyres.user.deaths !== 0 ? (tgmbodyres.user.kills / tgmbodyres.user.deaths).toFixed(2) : 'None';
    const winlossratio = (tgmbodyres.user.wins / tgmbodyres.user.losses).toFixed(2);

    // Formatting the initial join date and putting it into template.
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const initjoin = zanderplayerresults[0].joined;
    const initjoindate = `${initjoin.getDay()} ${months[initjoin.getMonth()]} ${initjoin.getFullYear()}`;

    if (err) {
      throw err;
      res.render('errorviews/500', {
        "pagetitle": "500: Internal Server Error"
      });
      return;
    } else {
      const reqplayeruuid = zanderplayerresults[0].uuid.replace(/-/g, '');

      // Query the database for the players data and online status.
      let sql = `select id, name, reason, operator, punishmentType from punishmenthistory where uuid = '${reqplayeruuid}';`

      abdatabase.query (sql, async function (err, punishmentresults) {
        if (err) {
          throw err;
          res.render('errorviews/500', {
            "pagetitle": "500: Internal Server Error"
          });
          return;
        } else {
          res.render('profile', {
            "pagetitle": `${req.params.username}'s Profile`,
            zanderplayerobjdata: zanderplayerresults,
            punishmentobjdata: punishmentresults,
            tgmres: tgmbodyres,
            tgmresboolean: tgmresbool,
            bedrockuser: bedrockuser,
            currentserver: capitalizeFirstLetter(zanderplayerresults[0].server),
            initjoindate: initjoindate,
            killdeathratio: killdeathratio,
            winlossratio: winlossratio
          });
        }
      });
    }
  });
});

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = router;
