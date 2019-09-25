const Rcon = require('modern-rcon');
const rcon = new Rcon(`${process.env.rconaddress}`, `${process.env.rconpassword}`);

rcon.connect().then(() => {
  console.log(chalk.blue('[RCON] ') + 'A remote connection has been made to the server.');
});

module.exports = rcon;
