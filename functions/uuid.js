// uuid.js
const fetchUrl = require("fetch").fetchUrl;

//
// Get a Players UUID
//
function get(username) {
  fetchUrl(`https://api.mojang.com/users/profiles/minecraft/${username}`, function (error, meta, body) {
    if (body.length === 0) {
      console.log("Username does not exist.");
      return
    }

    console.log(body.toString());
  });
};

module.exports = {
  get
};
