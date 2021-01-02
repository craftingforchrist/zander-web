const Discord = require('discord.js');

module.exports = async message => {
  const msgcontent = message.content;
  if (msgcontent.toLowerCase().includes("hello there")) {
    message.channel.send('General Kenobi');
    return;
  };
};
