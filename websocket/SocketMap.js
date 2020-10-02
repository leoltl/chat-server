const MissedMessageHandler = require('./MissedMessageHandler');

module.exports = function SocketMap() {
  const store = {}

  function set(identifier, socket) {
    store[identifier] = socket;
  }

  function get(identifier) {
    return store[identifier] || MissedMessageHandler.getInstance();
  }

  function del(socket) {
    Object.entries(store).forEach(([key, value]) => {
      if (value === socket) {
        delete store[key]
      }
    })
  }

  return {
    get,
    set,
    del,
  }
}
