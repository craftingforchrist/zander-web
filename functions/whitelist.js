const rcon = require('../controllers/rcon.js');

//
// Whitelist Add
//
function add(username) {
  rcon.send(`whitelist add ${username}`);
};

//
// Whitelist Remove
//
function remove(username) {
  rcon.send(`whitelist remove ${username}`);
};

module.exports = {
  add,
  remove
};
