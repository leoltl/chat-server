const Emitter = require('events');
const { makeChatServer, newConnectionHandler } = require('./chatServer');

class MockChatServer extends Emitter {
  constructor() {
    super();
  }
  on = jest.fn();
}

describe("chat server", () => {
  describe('on new websocket connection', () => {
    let mockChatServer;

    beforeEach(() => {
      mockChatServer = makeChatServer(new MockChatServer());
    });

    it('happy path', () => {
      const mockSocket = jest.fn();
      const mockReq = {};
      mockChatServer.emit('connection', mockSocket, mockReq);
      expect(mockChatServer.on).toBeCalledWith('connection', expect.any(Function))
    });
  });

  describe("newConnectionHandler", () => {
    it('should register an on message handler for the socket', () => {
      const mockSocket = { on: jest.fn() }
      newConnectionHandler(mockSocket, {});
      expect(mockSocket.on).toBeCalledWith('message', expect.any(Function))
    });
  });
});