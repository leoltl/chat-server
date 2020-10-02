const ws = require('ws');
const ClientToSocketMap = require('./SocketMap');
const MissedMessageHandler = require('./MissedMessageHandler');

const chatServer = new ws.Server({ 
  noServer: true, path: '/chat'
});

const clientToSocketMap = ClientToSocketMap();

function makeChatServer(server) {
  server.on('connection', onConnection);
  return server;
}

function onConnection(ws) {
  ws.on('close', onClose(ws));
  ws.on('message', onMessage(ws));
}

function onClose(ws) { 
  return function() {
    clientToSocketMap.del(ws)
  }
}

function onMessage(socket) {
  return function (data) {
    const { type, ...payload } = JSON.parse(data);
    const handler = MessageTypeHandler[type];
    if (handler) {
      handler(payload, socket)
    } else {
      // TODO: handle gracefully...
      throw Error('Invalid message type');
    }
  }
}

const MessageTypeHandler = {
  message: function message(payload, socket) {
    const { message, from, to } = payload;
    if (from === to) {
      const error_message = JSON.stringify({ type: 'error', from: 'server', message: 'Cannot message yourself.'})
      socket.send(error_message);
      return;
    }

    /*
    * recipient variable can be an actual socket connection, or if recipent is not online/ not registered via calling setIdentifier, 
    * the variable will be a MissedMessageHandler object which implements a send interface.
    */
    const recipient = clientToSocketMap.get(to);
    recipient.send(JSON.stringify({ type: 'message', from, to, message }))
    // ping back to sender
    socket.send(JSON.stringify({ type: 'message-loopback', from, to, message }));
    if (recipient.isOffline) {
      // notifiy sender that recipent is not online
      const info_message = JSON.stringify({ 
        type: 'info',
        from: 'server',
        message: `${to} is not online at the moment. Message will be delivered to ${to} as soon as he/she comes back online.`
      });
      socket.send(info_message);
    }

  },
  setIdentifier: function setIdentifier(payload, socket) {
    // store the relation of identifier to socket connection
    clientToSocketMap.set(payload.identifier, socket);
    socket.send(JSON.stringify({ type: 'setIdentifier', identifier: payload.identifier }));
    // check if there are any missed messages, if so redeliver all
    const missedMessages = MissedMessageHandler.getInstance();
    if (missedMessages.hasMessageFor(payload.identifier)) {
      missedMessages.redeliver(payload.identifier, socket);
    }
  }
}



module.exports = {
  server: makeChatServer(chatServer),
  makeChatServer,
  newConnectionHandler: onConnection,
  onClose,
  onMessage,
};