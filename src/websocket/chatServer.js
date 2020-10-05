const { Server } = require('ws');

const WSClient = require('./WSClient');
const WSClientsManager = require('./WSClientsManager');
const MissedMessageHandler = require('./MissedMessageHandler');

const wsClientsManager = WSClientsManager();

function makeChatServer(server) {
  server.on('connection', onConnection);
  return server;
}

function onConnection(socket) {
  socket.on('close', onClose(socket));
  socket.on('message', makeOnMessage(MessageTypeHandler));
}

function onClose(socket) { 
  return function() {
    wsClientsManager.del(socket)
  }
}

function makeOnMessage(messageHandlers) {
  return function onMessage(data) {
    const { type, ...payload } = JSON.parse(data);
    const handler = messageHandlers[type];
    if (handler) {
      handler(payload)
    }
  }
}

const MessageTypeHandler = {
  message: makeMessageHandler(wsClientsManager),
  setIdentifier: makeSetIdentifierHandler(MissedMessageHandler),
}

function makeMessageHandler(clientsManager) {
  return function messageHandler(payload) {
    const { message, from, to } = payload;
    if (from === to) {
      const error_message = JSON.stringify(
        { type: 'error', from: 'server', message: 'Cannot message yourself.' }
      )
      clientsManager.sendTo(from, 'server', error_message);
      return;
    }
    
    const timestamp = Date.now();
    // send to receipent
    clientsManager.sendTo(
      to, from, JSON.stringify({ type: 'message', from, to, message, timestamp })
    );
    
    // ping back to sender
    clientsManager.sendTo(
      from, from, JSON.stringify({ type: 'message-loopback', from, to, message, timestamp })
    );
  }
}

function makeSetIdentifierHandler(clientsManager, missedMessageHandler) {
  return function setIdentifierHandler(payload, socket) {
    const { identifier } = payload;
    const client = new WSClient(identifier, socket);
  
    // add client to clients manager
    clientsManager.add(client);
  
    // ack setIdentifier success
    clientsManager.sendTo(identifier, JSON.stringify({ type: 'setIdentifier', identifier: identifier }));
  
    // check if there are any missed messages, if so redeliver all
    const missedMessages = missedMessageHandler.getInstance();
    if (missedMessages.hasMessageFor(identifier)) {
      missedMessages.redeliver(identifier, client);
    }
  }
}


const chatServer = new Server({ 
  noServer: true, path: '/chat'
});

module.exports = {
  server: makeChatServer(chatServer),
  makeChatServer,
  onConnection,
  onClose,
  onMessage: makeOnMessage,
  makeMessageHandler,
  makeSetIdentifierHandler,
};