import React from 'react';
import ChatInput from './components/ChatInput';
import ChatJoin from './components/ChatJoin';
import ChatList from './components/ChatList';
import ChatTabs from './components/ChatTabs';
import { HOST } from './constants';

import './ChatWindow.scss';

export default function Chat({ setExpanded, state, setIdentifier, sendMessage, setChatWith }) {
  function setUserIdentifier(e) {
    if (e.key === 'Enter') {
      setIdentifier(e.target.value);
    }
  }
  
  const activeChats = Object.keys(state).filter(key => !(key === 'identifier' || key === 'chatWith' || key === 'unread'));
  const currentChat = state[state.chatWith] || [];

  return (
    <div className="app">
      <nav>
        <div className="minimize" onClick={()=> setExpanded(prev => !prev)}></div>
        {state.identifier === HOST && 
          <ChatTabs 
            unread={state.unread}
            chatWith={state.chatWith}
            setChatWith={setChatWith}
            activeChats={activeChats}
          />
        } 
      </nav>
      {
        state.identifier ? (
          <div className="chat-window">
            <ChatList currentChat={currentChat} from={state.identifier} />
            <ChatInput chatWith={state.chatWith} sendMessage={sendMessage} />
          </div>
        ) : (
          <ChatJoin handleSetName={setUserIdentifier}/>
        )
      }
    </div>
  )
}