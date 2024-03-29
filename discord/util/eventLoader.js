const reqEvent = (event) => require(`../events/${event}`)

module.exports = (client) => {
  client.on('message', reqEvent('message'));
  client.on('messageDelete', reqEvent('messageDelete'));
  client.on('messageUpdate', reqEvent('messageUpdate'));
  // client.on('guildMemberAdd', reqEvent('guildMemberAdd'));
  client.on('guildMemberUpdate', reqEvent('guildMemberVerify'));
};
