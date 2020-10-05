class MissedMessageHandler {
  constructor() {
    this.store = {}
  }

  send(payload) {
    const { to } = JSON.parse(payload);
    this.store[to] = this.store[to] || [];
    this.store[to].push(payload);
  }

  redeliver(identifier, client) {
    const missedMessagesList = this.store[identifier] 
    if (missedMessagesList) {
        missedMessagesList.forEach((payload) => {
          client.send(payload)
        });
      delete this.store[identifier]
    }
  }

  hasMessageFor(identifier) {
    return Boolean(this.store[identifier]);
  }

  get isOffline() {
    return true
  }
}

module.exports = {
  MissedMessageHandler,
  instance: null,
  getInstance() {
    if (!this.instance) {
      this.instance = new MissedMessageHandler();
    }
    return this.instance;
  }
}