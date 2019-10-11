const rcon = require('../controllers/rcon');
const validation = require('./validation');

//
// Whitelist Add
//
function add(username) {
  validation.validateusername(username);
  rcon.send(`whitelist add ${username}`);
  console.log(`[RCON] ${username} has been added to the whitelist.`);
};

//
// Whitelist Remove
//
function remove(username) {
  validation.validateusername(username);
  rcon.send(`whitelist remove ${username}`);
  console.log(`[RCON] ${username} has been removed from the whitelist.`);
};

module.exports = {
  add,
  remove
};
