const { MissedMessageHandler } = require('./MissedMessageHandler');

describe("MissedMessageHandler", () => {

  describe("send and hasMessageFor", () => {
    it("should return false if no message is for identifier", () => {
      const missedMessage = new MissedMessageHandler();
      expect(missedMessage.hasMessageFor('noone')).toBe(false);
    });

    it("should store message for recipient and should return true if messages is for identifier", () => {
      const missedMessage = new MissedMessageHandler();
      const msg = JSON.stringify({ to: 'user', message: 'test' });
      missedMessage.send(msg)
      expect(missedMessage.hasMessageFor('user')).toBe(true);
    });
  });

  describe("redeliver", () => {
    it('should send all stored message for identifier', () => {
      const missedMessage = new MissedMessageHandler();
      const msg = JSON.stringify({ to: 'user', message: 'test' });
      const mockClient = { send: jest.fn() };
      missedMessage.send(msg);
      missedMessage.send(msg);
      missedMessage.redeliver('user', mockClient);
      expect(mockClient.send).toBeCalledTimes(2);
    });

    it('should remove message after sending all stored message for identifier', () => {
      const missedMessage = new MissedMessageHandler();
      const msg = JSON.stringify({ to: 'user', message: 'test' });
      const mockClient = { send: jest.fn() };
      missedMessage.send(msg);
      missedMessage.send(msg);
      missedMessage.redeliver('user', mockClient);
      expect(missedMessage.hasMessageFor('user')).toBe(false);
    });
  });
});