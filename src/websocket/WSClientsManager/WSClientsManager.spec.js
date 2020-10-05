const WSClientsManager = require('./WSClientsManager');
const { MissedMessageHandler } = require('../MissedMessageHandler/MissedMessageHandler');

describe("WSClientsManager", () => {

  describe("add and get", () => {
    it("happy path", () => {
      const Manager = WSClientsManager();
      const mockClient = { identifier: 'test' }
      Manager.add(mockClient);
      expect(Manager.get('test')).toBe(mockClient);
    });

    it("returns a MissedMessageHandler instance if client does not exist", () => {
      const Manager = WSClientsManager();
      expect(Manager.get('test')).toEqual(expect.any(MissedMessageHandler));
    });
  });

  describe("sendTo", () => {
    it("happy path", () => {
      const Manager = WSClientsManager();
      const mockClient = { identifier: 'test', send: jest.fn() };
      Manager.add(mockClient);

      Manager.sendTo('test', '', 'message...');
      expect(mockClient.send).toBeCalledWith('message...')
    });

    it("if to is not registered in manager, from should receive a info message", () => {
      const Manager = WSClientsManager();
      const mockFrom = { identifier: 'test', send: jest.fn() };
      Manager.add(mockFrom);

      Manager.sendTo('offline', 'test', JSON.stringify({to: '', message: 'message...'}));
      expect(mockFrom.send).toBeCalledWith(expect.stringContaining('"type\":\"info\"'))
    });
  });
  
});