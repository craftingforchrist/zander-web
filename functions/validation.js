const rcon = require('../controllers/rcon.js');
const fetchUrl = require("fetch").fetchUrl;

//
// Username Validation
//
function validateusername(username) {
  try {
    fetchUrl(`https://api.mojang.com/users/profiles/minecraft/${username}`, function (error, meta, body) {
      if (body.length === 0) {
        console.log('[VALIDATOR] This is not a valid username!');
        throw new Error("Something went wrong...");
      }

      console.log(`[VALIDATOR] ${username} is a valid username, finishing process.`);
      // console.log(body.toString());
    });
  } catch (e) {
    console.log("Something went wrong...");
  }
};

module.exports = {
  validateusername
};
