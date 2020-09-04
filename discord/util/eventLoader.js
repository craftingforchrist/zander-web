const reqEvent = (event) => require(`../events/${event}`)

module.exports = (client) => {
  client.on('messageDelete', reqEvent('messageDelete'));
  client.on('messageUpdate', reqEvent('messageUpdate'));
  client.on('message', reqEvent('message'));
};
