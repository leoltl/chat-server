export const HOST = 'Agent';

// CHAT_URL can be loaded at compile time from env variable, default to localhost:3000
export const CHAT_URL = process.env.CHAT_URL || "ws://localhost:3000/chat"