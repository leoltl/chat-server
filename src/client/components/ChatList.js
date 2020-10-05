import React, { useLayoutEffect, useRef } from 'react';

import ChatItem from './ChatItem';

export default function ChatList({ from, currentChat }) {
  const listBottom = useRef(null);
  const list = useRef(null);
  const scrollToBottom = () => {
    if (listBottom.current) {
      list.current.scrollTo(0, listBottom.current.getBoundingClientRect().top)
    }
  }

  useLayoutEffect(scrollToBottom, [currentChat.length]);
  return (
    <div className="chat-list" ref={list}>
      {currentChat.map(chat => 
        <ChatItem 
          key={chat.timestamp}
          chat={chat}
          from={from}
        />
      )}
      <div className="chat-btm" ref={listBottom} key="bottom"></div>
    </div>
  )
}
