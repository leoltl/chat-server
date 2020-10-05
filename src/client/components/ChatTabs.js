import React from 'react';

export default function Tabs({ chatWith, setChatWith, activeChats, unread }) {
  console.log(unread, unread.has('Leo'))
  function handleSetChatWith(name) {
    return function () {
      if (chatWith === name) {
        // unselect currentChat
        setChatWith('');
        return
      }
      // select currentChat
      setChatWith(name);
    }
  }

  return (
    <div className="tabs">
      {activeChats.map((name) => (
        <div className={`tab${unread.has(name) ? ' tab--unread' : ''}`} onClick={handleSetChatWith(name)} key={name}>
          {name}
        </div>
      ))}
    </div>
  )
}