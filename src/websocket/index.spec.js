const Emitter = require('events');
const { makeRegisterWSUpgradeHandler }  = require('./index');

class MockChatServer extends Emitter {
  constructor() {
    super();
  }
  handleUpgrade = jest.fn();
}

describe("websocket", () => {
  describe("websocket upgrade", () => {
    let mockChatServer, mockServer, mockSocket, registerWSUpgradeHandler
    beforeEach(() => {
      mockSocket = {
        write: jest.fn(),
        destroy: jest.fn(),
      };
      mockServer = new Emitter();
      mockChatServer = new MockChatServer();
      registerWSUpgradeHandler = makeRegisterWSUpgradeHandler('/chat', mockChatServer)
    });

    it('happy path', () => {
      const mockReq = { url: '/chat' };
      registerWSUpgradeHandler(mockServer);
      mockServer.emit('upgrade', mockReq, mockSocket, {})
      
      expect(mockChatServer.handleUpgrade).toBeCalledWith(
        mockReq, mockSocket, expect.anything(), expect.anything(),
      );
    });

    it('reject ws upgrade request on unmatching path', () => {
      const mockReq = { url: '/not-match' };
      registerWSUpgradeHandler(mockServer);
      mockServer.emit('upgrade', mockReq, mockSocket, {})
      
      expect(mockChatServer.handleUpgrade).not.toBeCalled();
      expect(mockSocket.destroy).toBeCalled();
    });
  });
});