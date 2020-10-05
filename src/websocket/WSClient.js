class WSClient {
  constructor(identifier, socket) {
    this.identifier = identifier;
    this.socket = socket;
  }

  send(payload) {
    this.socket.send(payload);
    // add db call below if we need to persist message here in the future.
  }

  match(socket) {
    return socket === this.socket;
  }

  destroy() {
    // dereference socket so it can be garbage collected 
    this.socket = null;
  }
}

module.exports = WSClient;