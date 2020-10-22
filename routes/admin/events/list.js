const express = require('express');
const moment = require('moment');
const router = express.Router();
const HexColour = require('../../../HexColour.json');
const config = require('../../../config.json');
const database = require('../../../controllers/database.js');
const accounts = require('../../../functions/admin/accounts.js');
const Discord = require('discord.js');
const client = new Discord.Client({ disableEveryone: true });


module.exports = (client) => {
  router.get('/', (req, res, next) => {
    if (req.session.user) {
      database.query(`SELECT * FROM events ORDER BY eventdatetime DESC;`, function (error, results, fields) {
        if (error) {
          throw error;
          res.render('errorviews/500', {
            "pagetitle": "500: Internal Server Error"
          });
          return;
        } else {
          res.render('admin/events/list', {
            "pagetitle": "Administration Panel - Events",
            objdata: results,
            moment: moment
          });
        };
      });
    } else {
      res.render('session/login', {
        setValue: true,
        message: 'You cannot access this page unless you are logged in.',
        "pagetitle": "Login"
      });
    };
  });

  router.post('/', function (req, res) {
    if (req.session.user) {
      const action = req.body.action;
      const id = req.body.id;

      if (action === "delete") {
        database.query(`SELECT * FROM events WHERE id=?;`, [id], function (error, results, fields) {
          if (error) {
            throw error;
            res.render('errorviews/500', {
              "pagetitle": "500: Internal Server Error"
            });
            return;
          } else {
            const title = results[0].title;
            const icon = results[0].icon;
            const datetime = results[0].eventdatetime;

            // Take event that was just created and announce it to Discord.
            let eventschannel = client.channels.cache.find(c => c.name === `${config.eventschannel}`);
            if (!eventschannel) return console.log(`A #${config.eventschannel} channel does not exist.`);

            var embed = new Discord.MessageEmbed()
              .setTitle(`Event Cancelled`)
              .setDescription(`The event ${title} that was scheduled for ${moment(datetime).format('LLLL')} has been cancelled.`)
              .setThumbnail(icon)
              .setColor(HexColour.eventcancelled)
            eventschannel.send(embed);
            console.log(`[CONSOLE] [DISCORD] The event "${title}" has been cancelled, broadcasting to Discord.`);

            const id = req.body.id;
            database.query(`DELETE FROM events WHERE id=?;`, [id], function (error, results, fields) {
              if (error) {
                throw error;
                res.render('errorviews/500', {
                  "pagetitle": "500: Internal Server Error"
                });
                return;
              } else {
                res.redirect('/admin/events');
              }
            });
          }
        });
      };

      if (action === "edit") {
        database.query(`SELECT * FROM events WHERE id=?;`, [id], function (error, results, fields) {
          if (error) {
            throw error;
            res.render('errorviews/500', {
              "pagetitle": "500: Internal Server Error"
            });
            return;
          } else {
            res.render('admin/events/edit', {
              "pagetitle": `Administration Panel - Event Editor - ${results[0].title}`,
              objdata: results
            });
          }
        });
      };
    } else {
      res.render('session/login', {
        setValue: true,
        message: 'You cannot access this page unless you are logged in.',
        "pagetitle": "Login"
      });
    };
  });

  return router;
};
