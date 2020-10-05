import React, { useState } from 'react';

export default function ChatInput({ chatWith, sendMessage }) {
  const [message, setMessage]= useState('');
  function handleSendMessage(e) {
    if (e.key === 'Enter') {
      sendMessage(chatWith, message);
      setMessage('');
    }
  }
  
  return (
    <div className="chat-input">
      <input
        className="input"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleSendMessage}
        placeholder="Reply here..."
        disabled={!Boolean(chatWith)}
      />
      <button
        className="btn btn-primary"
        onClick={() => handleSendMessage({ key: 'Enter' })}
        disabled={!Boolean(chatWith)}
      >
        Send
      </button>
    </div>
  )
}