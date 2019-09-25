const Rcon = require('modern-rcon');
const rcon = new Rcon(`${process.env.rconaddress}`, `${process.env.rconpassword}`);
const chalk = require('chalk');

rcon.connect().then(() => {
  console.log('Remote Connection has been made.');
});

module.exports = rcon;
