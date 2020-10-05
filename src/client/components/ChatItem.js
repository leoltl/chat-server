import React from 'react';

export default function ChatItem({ chat, from }) {
  function getClass(chat) {
    if (chat.from === from) {
      return 'chat-item--self'
    }
    if (chat.from === 'server') {
      return 'chat-item--info'
    }
    return 'chat-item--new'
  }
  const messageClass = getClass(chat);
  return (
    <div className={`chat-item ${messageClass}`}>
      <p>{chat.message}</p>
    </div>
  )
}
