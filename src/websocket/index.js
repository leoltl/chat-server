const { server: ChatServer } = require('./chatServer');

function makeRegisterWSUpgradeHandler(upgradePath, chatServer = ChatServer) {
  return function registerWSUpgradeHandler(server) {
    server.on('upgrade', (req, socket, head) => {
      if (req.url === upgradePath) {
        chatServer.handleUpgrade(req, socket, head, function (ws) {
          chatServer.emit('connection', ws, req)
        });
        return;
      }
      socket.write('HTTP/1.1 400 Bad Request\r\n\r\n');
      socket.destroy();
    });
  }
}

module.exports = {
  makeRegisterWSUpgradeHandler
}
