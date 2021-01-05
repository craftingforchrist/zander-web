const Discord = require('discord.js');
const config = require('../../../config.json');
const HexColour = require('../../../HexColour.json');
const database = require('../../../controllers/database'); // Database controller
const lpdatabase = require('../../../controllers/lpdatabase'); // LP Database controller

module.exports.run = async (client, message, args) => {
  const user = message.guild.member(message.author); // Get the command user.
  const roles = user.roles.cache; // Get the users roles.
  const userRolesArr = [];
  // Put all roles into an array.
  roles.forEach(function (data) {
    userRolesArr.push(data.name);
  });

  // Check if the user has role access to this command.
  if (userRolesArr.some(role => config.administrationroles.includes(role))) {
    // console.log("You have access.");
  } else {
    let embed = new Discord.MessageEmbed()
      .setTitle('Error!')
      .setColor('#ff6666')
      .setDescription('You do not have permission to execute this command.')
    message.channel.send(embed).then(msg => msg.delete({ timeout: 3000 }));
    return;
  };

  if (typeof(args[0]) == "undefined") {
    let embed = new Discord.MessageEmbed()
      .setTitle('Error')
      .setDescription(`Please use the correct command usage:\n${process.env.discordprefix}lp [promote/demote] [player] [rank]\n${process.env.discordprefix}lp [player] [ranks]`)
      .setColor(HexColour.red)
    message.channel.send(embed);
    return;
  };

  let zandersql = `select uuid, username from playerdata where username = ?;`;
  database.query(zandersql, [`${args[0]}`], async function (err, zanderplayerresults) {
    if (err) {
      let embed = new Discord.MessageEmbed()
        .setTitle('Error')
        .setDescription(`Something went wrong, try again later.`)
        .setColor(HexColour.red)
      message.channel.send(embed);
      throw err;
    }

    if (typeof(zanderplayerresults[0]) == "undefined") {
      let embed = new Discord.MessageEmbed()
        .setTitle('Player Not Found')
        .setDescription(`The player that you have requested could not be found, please try again.`)
        .setColor(HexColour.red)
      message.channel.send(embed);
      return
    };

    const { uuid, username } = zanderplayerresults[0];
    let lpsql = `select permission from luckperms_user_permissions where uuid = ?;`;
    lpdatabase.query(lpsql, [`${uuid}`], async function (err, lpresults) {
      if (err) {
        let embed = new Discord.MessageEmbed()
          .setTitle('Error')
          .setDescription(`Something went wrong, try again later.`)
          .setColor(HexColour.red)
        message.channel.send(embed);
        throw err;
      };

      // Get all ranks from the UUID
      const playerRanksArray = [];
      const playerRanks = lpresults.forEach(function (data) {
        const permission = data.permission;

        let rankName = permission.replace('group.', '');
        // playerRanksArray.push(capitalizeFirstLetter(rankName));
        playerRanksArray.push(rankName);
      });

      switch (args[1]) {
        //
        // Promote a User.
        //
        case 'promote':
          const promotedRole = args[2];

          if (typeof(promotedRole) == "undefined") {
            let embed = new Discord.MessageEmbed()
              .setTitle('Role Not Found')
              .setDescription(`${username} either does not have this rank or this rank does not exist, please try again.`)
              .setColor(HexColour.red)
            message.channel.send(embed);
            return;
          };

          if (promotedRole == 'default') {
            let embed = new Discord.MessageEmbed()
              .setTitle('Error!')
              .setDescription(`This role cannot be removed.`)
              .setColor(HexColour.red)
            message.channel.send(embed);
            return;
          }

          if (playerRanksArray.includes(`${promotedRole}`)) {
            let embed = new Discord.MessageEmbed()
              .setTitle('Role already assigned')
              .setDescription(`${username} already has this rank.`)
              .setColor(HexColour.yellow)
            message.channel.send(embed);
            return;
          } else {
            let lpsql = `insert into luckperms_user_permissions (uuid, permission, value, server, world, expiry, contexts) values (?, ?, 1, "global", "global", 0, "{}");`;
            lpdatabase.query(lpsql, [`${uuid}`, `group.${promotedRole}`], async function (err, lpresults) {
              if (err) {
                let embed = new Discord.MessageEmbed()
                  .setTitle('Error')
                  .setDescription(`Something went wrong, try again later.`)
                  .setColor(HexColour.red)
                message.channel.send(embed);
                throw err;
              } else {
                let embed = new Discord.MessageEmbed()
                  .setTitle('Successfully Promoted')
                  .setDescription(`${username} has been successfully promoted to ${promotedRole}.`)
                  .setColor(HexColour.green)
                message.channel.send(embed);
              }
            });
          }
          break;

        //
        // Demote a User.
        //
        case 'demote':
          const demotedRole = args[2];
          if (typeof(demotedRole) == "undefined") {
            let embed = new Discord.MessageEmbed()
              .setTitle('Role Not Found')
              .setDescription(`${username} either does not have this rank or this rank does not exist, please try again.`)
              .setColor(HexColour.red)
            message.channel.send(embed);
            return;
          };

          if (demotedRole == 'default') {
            let embed = new Discord.MessageEmbed()
              .setTitle('Error!')
              .setDescription(`This role cannot be removed.`)
              .setColor(HexColour.red)
            message.channel.send(embed);
            return;
          }

          if (playerRanksArray.includes(`${demotedRole}`)) {
            let lpsql = `delete from luckperms_user_permissions where uuid = ? and permission = ?;`;
            lpdatabase.query(lpsql, [`${uuid}`, `group.${demotedRole}`], async function (err, lpresults) {
              if (err) {
                let embed = new Discord.MessageEmbed()
                  .setTitle('Error')
                  .setDescription(`Something went wrong, try again later.`)
                  .setColor(HexColour.red)
                message.channel.send(embed);
                throw err;
              } else {
                let embed = new Discord.MessageEmbed()
                  .setTitle('Successfully Demoted')
                  .setDescription(`${username} has been successfully demoted from ${demotedRole}.`)
                  .setColor(HexColour.yellow)
                message.channel.send(embed);
              }
            });
          } else {
            let embed = new Discord.MessageEmbed()
              .setTitle('Role Not Found')
              .setDescription(`${username} either does not have this rank or this rank does not exist, please try again.`)
              .setColor(HexColour.red)
            message.channel.send(embed);
            return;
          }
          break;

        //
        // List all of the ranks that a User has.
        //
        case 'ranks':
          let embed = new Discord.MessageEmbed()
            .setTitle(`${username}'s Ranks`)
            .setThumbnail (`https://crafatar.com/avatars/${uuid}?overlay`)
            .setDescription(`${playerRanksArray.join(" \n ")}`)
            .setColor(HexColour.lightblue)
          message.channel.send(embed);
          break;

        default:
        break;
      }
    })
  })
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports.help = {
  name: 'lp',
  description: 'Promote and demote users.',
  usage: 'lp [player] [promote/demote/ranks] [rank]'
};
