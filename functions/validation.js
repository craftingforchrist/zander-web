const rcon = require('../controllers/rcon.js');

//
// Whitelist Add
//
function validateusername(username) {
  if (username > 16) {
    console.log('[VALIDATOR] Username is over 16 characters');
    return;
  }
};

module.exports = {
  validateusername
};
