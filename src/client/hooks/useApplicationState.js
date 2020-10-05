import React, { useEffect, useReducer } from 'react';
import { CHAT_URL, HOST } from '../constants';

let wsConnection

function connectChat(url) {
  return new Promise((resolve, reject) => {
    const conn = new WebSocket(url);
    conn.onopen = () => resolve(conn)
    conn.onerror = (err) => reject(err)
  })
}

function reducer(state, action) {
  const {unread} = state;
  switch(action.type) {
    case 'setIdentifier':
      return {...state, identifier: action.payload.identifier };
    case 'message':
      unread.add(action.payload.from)
      return {...state, [action.payload.from]: [...(state[action.payload.from] || []), action.payload ] }
    case 'message-loopback':
      return {...state, [action.payload.to]: [...(state[action.payload.to] || []), action.payload ] }
    case 'chat-with':
      unread.delete(action.payload.to)
      return {...state, chatWith: action.payload.to }
    case 'info':
      return {...state, [action.payload.to]: [...(state[action.payload.to] || []), action.payload ] }
    default:
      return state;
  }
}

const initialState = {
  identifier: null,
  chatWith: HOST,
  unread: new Set(),
}

export default function useApplicationState() {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  useEffect(() => {
    (async function(){
      try {
        wsConnection = await connectChat(CHAT_URL);
        wsConnection.onmessage = function onMessage(msg) {
          const { type, ...payload } = JSON.parse(msg.data);
          dispatch({ type, payload });
        }
      } catch (e) {
        // TODO handle connect error
        console.log(e);
      }
    }());
    return () => {
      console.log('closing connection...')
      wsConnection.close();
    }
  }, []);

  function setIdentifier(identifier) {
    wsConnection.send(JSON.stringify({ type: 'setIdentifier', identifier }));
  }

  function sendMessage(to, message) {
    if (message) {
      wsConnection.send(JSON.stringify({ type: 'message', from: state.identifier, to, message }));
    }
  }

  function setChatWith(to) {
    dispatch({ type: 'chat-with', payload: { to } })
  }

  return {
    state,
    sendMessage,
    setIdentifier,
    setChatWith,
  }
}