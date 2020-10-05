import React, { useState } from 'react';

import ChatWindow from './components/ChatWindow';
import useApplicationState from './hooks/useApplicationState';
import './App.scss';

export default function App() {
  const { state, setIdentifier, sendMessage, setChatWith } = useApplicationState();
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      {expanded ? (
          <ChatWindow {...{setExpanded, state, setIdentifier, sendMessage, setChatWith}} />
        ) : (
          <div className="launcher" onClick={() => setExpanded(!expanded)}></div>
        )
      }
    </>
  )
}