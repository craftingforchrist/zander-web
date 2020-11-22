const Discord = require('discord.js');
const config = require('../../config.json')

module.exports = async message => {
  const msgcontent = message.content;
  if (msgcontent.toLowerCase().includes("hello there")) {
    message.channel.send('General Kenobi');
    return;
  };
};
