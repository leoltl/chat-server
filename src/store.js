const fs = require('fs');

class MessageStore {

  init() {
    try {
      const text = fs.readFileSync('./history.txt');
      this.store = JSON.parse(text);
    } catch (e) {
      if (e.code ==='ENOENT') {
        this.store = {};
        return;
      }
      throw(e)
    }
  }

  persist() {
    fs.writeFile('./history.txt', JSON.stringify(this.store), (err) => {
      if (err) {
        console.warn(err);
      }
      console.log('persisted');
    })
  }

  save(identifier, payload) {
    // history group by who the host is chatting with
    this.store[identifier] = [...(this.store[identifier] || []), payload];
    this.persist();
  }
}

module.exports = {
  MessageStore,
  instance: null,
  getInstance() {
    if (!this.instance) {
      this.instance = new MessageStore();
    }
    return this.instance;
  }
};