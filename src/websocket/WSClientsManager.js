const MissedMessageHandler = require('./MissedMessageHandler');

module.exports = function WSClientsManager() {
  const store = {}

  function add(client) {
    store[client.identifier] = client;
  }

  function get(identifier) {
    return store[identifier] || MissedMessageHandler.getInstance();
  }

  function del(socket) {
    Object.entries(store)
      .forEach(([identifier, client]) => {
        if (client.match(socket)) {
          client.destroy();
          delete store[identifier]
        }
      })
  }

  function sendTo(to, from, message) {
    /*
    * recipient variable can be an actual socket connection, or if recipent is not online/ not registered via calling setIdentifier, 
    * the variable will be a MissedMessageHandler object which implements a send interface.
    */
    const recipient = this.get(to);
    recipient.send(message);

    if (recipient.isOffline) {
      // notifiy sender that recipent is not online
      const info_message = JSON.stringify({ 
        type: 'info',
        from: 'server',
        message: `${to} is not online at the moment. Message will be delivered to ${to} as soon as he/she comes back online.`,
        to,
      });
      this.get(from).send(info_message);
    }
  }

  return {
    get,
    add,
    del,
    sendTo,
  }
}
