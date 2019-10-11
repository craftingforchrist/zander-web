// uuid.js
const mojangapi = require('mojang-api');

//
// Get a Players UUID
//
function get(username) {
  mojangapi.nameToUuid(username, function(err, res) {
    if (err) {
      console.log(err);
    }
    return `${res[0].id}`;
  });
};

module.exports = {
  get
};
