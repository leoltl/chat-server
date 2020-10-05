const Emitter = require('events');
const WSClient = require('./WSClient');
const { makeChatServer, onConnection, onMessage, makeMessageHandler, makeSetIdentifierHandler } = require('./chatServer');

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

  describe("onConnection", () => {
    it('should register an on message handler for the socket', () => {
      const mockSocket = { on: jest.fn() }
      onConnection(mockSocket, {});
      expect(mockSocket.on).toBeCalledWith('message', expect.any(Function))
      expect(mockSocket.on).toBeCalledWith('close', expect.any(Function))
    });
  });

  describe("onMessage", () => {
    let mockMessageHandlers;
    beforeEach(() => {
      mockMessageHandlers = { message: jest.fn() };
    });
    
    it('should call message handler based on data\'s type', () => {
      const handler = onMessage(mockMessageHandlers);
      const mockMessage = JSON.stringify({ type: 'message', payload: 'test' });
      handler(mockMessage);
      expect(mockMessageHandlers.message).toBeCalledWith({ payload: 'test' });
    });

    it('should ignore invalid type', () => {
      const handler = onMessage(mockMessageHandlers);
      const mockMessage = JSON.stringify({ type: 'invalid', payload: 'test' });
      handler(mockMessage);
      expect(mockMessageHandlers.message).not.toBeCalled();
    });
  });

  describe("messageHandler", () => {
    let mockClientsManager, messageHandler;
    beforeEach(() => {
      mockClientsManager = { sendTo: jest.fn() };
      messageHandler = makeMessageHandler(mockClientsManager);
    });

    it('happy path', () => {
      const payload = { type: 'message', from: 'user', to: 'Agent', message: 'test'};
      messageHandler(payload);

      expect(mockClientsManager.sendTo)
        .toBeCalledWith(payload.to, payload.from, expect.stringContaining('"type\":\"message\"'));
      expect(mockClientsManager.sendTo)
        .toBeCalledWith(payload.from, payload.from, expect.stringContaining('"type\":\"message-loopback\"'));
    });
    it('sends an error message if user sending to him/herself', () => {
      const payload = { type: 'message', from: 'user', to: 'user', message: 'test'};
      messageHandler(payload);

      expect(mockClientsManager.sendTo)
        .toBeCalledWith(payload.to, "server", expect.stringContaining('"type\":\"error\"'));
    });
  });

  describe("setIdentifierHandler", () => {
    let mockClientsManager;
    const mockSocket = {};
    const mockMissedMessageHandler = (hasMessageFor, redeliver) => {
      return { getInstance: () => ({ hasMessageFor, redeliver }) }
    }
    beforeEach(() => {
      mockClientsManager = { add: jest.fn(), sendTo: jest.fn() };
    });

    it('happy path', () => {
      const payload = { type: 'setIdentifier', identifier: 'test' };
      const setIdentifierHandler = makeSetIdentifierHandler(mockClientsManager, mockMissedMessageHandler(jest.fn().mockReturnValue(false)));
      setIdentifierHandler(payload, mockSocket);

      expect(mockClientsManager.add).toBeCalledWith(expect.any(WSClient));
      expect(mockClientsManager.sendTo).toBeCalledWith(payload.identifier, expect.any(String));
    });

    it('should call redeliver method if hasMessageFor method call returns true', () => {
      const payload = { type: 'setIdentifier', identifier: 'test' };
      const hasMessageFor = jest.fn().mockReturnValue(true);
      const redeliver = jest.fn();
      const setIdentifierHandler = makeSetIdentifierHandler(mockClientsManager, mockMissedMessageHandler(hasMessageFor, redeliver));
      setIdentifierHandler(payload, mockSocket);

      expect(redeliver).toBeCalledWith(payload.identifier, expect.any(WSClient));
    });
  });
});