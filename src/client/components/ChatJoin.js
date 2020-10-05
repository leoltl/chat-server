import react from "react";
import React, { useRef } from 'react';

import { HOST } from '../constants';

export default function ChatJoin({ handleSetName }) {
  const inputEl = useRef(null);
  return (
    <div className="join-chat">
      <h2>We'd love to help</h2>
      <input
        className="input"
        ref={inputEl}
        onKeyPress={handleSetName}
        placeholder="Please enter your name..."
        autoFocus={true}
      />
      <button 
        className="btn btn-primary" 
        onClick={() => handleSetName({ key: 'Enter', target: { value: inputEl.current.value } })}>
        Connect
      </button>
      <button
        className="btn btn-secondary"
        onClick={() => handleSetName({ key: 'Enter', target: { value: HOST } })}>
        Connect as agent
      </button>
    </div>
  )
}