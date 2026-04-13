import { useReducer, useRef } from 'react';
import { API_URLS } from '../../services/config';
import Reducer from './reducer';
import { AIChatActions } from './action';
import { useAuth } from '../AuthContext';

export const initialState = {
  messages: [],
  loading: false,
  streaming: false,
  error: null,
};

// Parse a single SSE "data: <payload>" line.
// Returns the text chunk, '[DONE]', or null.
function parseSseLine(line) {
  if (!line.startsWith('data:')) return null;
  const payload = line.slice(5).trim();
  if (!payload) return null;
  if (payload === '[DONE]') return '[DONE]';
  try {
    const parsed = JSON.parse(payload);
    return (
      parsed.content ??
      parsed.text ??
      parsed.message ??
      parsed.response ??
      parsed.answer ??
      null
    );
  } catch {
    return payload; // plain-text chunk
  }
}

export const AIChatState = () => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  const { token } = useAuth();
  const xhrRef = useRef(null);

  const ask = (message) => {
    const trimmed = (message || '').trim();
    if (!trimmed) return;

    // Cancel any in-flight request
    if (xhrRef.current) {
      xhrRef.current.abort();
      xhrRef.current = null;
    }

    // Add user message
    dispatch({
      type: AIChatActions.ADD_MESSAGE,
      payload: { id: Date.now().toString(), role: 'user', text: trimmed },
    });

    // Add empty assistant placeholder and mark streaming started
    const assistantMsgId = (Date.now() + 1).toString();
    dispatch({ type: AIChatActions.START_AI_STREAMING, payload: assistantMsgId });

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;
    let processedLength = 0;
    let buffer = '';
    let done = false;

    const processBuffer = () => {
      // Split on newlines, keep last incomplete line in buffer
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        const chunk = parseSseLine(line.trim());
        if (chunk === '[DONE]') {
          done = true;
          dispatch({ type: AIChatActions.FINISH_AI_STREAMING });
          xhr.abort();
          xhrRef.current = null;
          return;
        }
        if (chunk) {
          dispatch({ type: AIChatActions.APPEND_AI_TEXT, payload: chunk });
        }
      }
    };

    // readyState 3 = LOADING: fires each time new data arrives (streaming)
    xhr.onreadystatechange = () => {
      if (done) return;

      if (xhr.readyState === 3 || xhr.readyState === 4) {
        const newData = xhr.responseText.slice(processedLength);
        processedLength = xhr.responseText.length;
        if (newData) {
          buffer += newData;
          processBuffer();
        }
      }

      if (xhr.readyState === 4 && !done) {
        // Flush remaining buffer
        if (buffer.trim()) {
          const chunk = parseSseLine(buffer.trim());
          if (chunk && chunk !== '[DONE]') {
            dispatch({ type: AIChatActions.APPEND_AI_TEXT, payload: chunk });
          }
        }
        xhrRef.current = null;
        dispatch({ type: AIChatActions.FINISH_AI_STREAMING });
      }
    };

    xhr.onerror = () => {
      if (done) return;
      xhrRef.current = null;
      dispatch({
        type: AIChatActions.APPEND_AI_TEXT,
        payload: 'Sorry, a connection error occurred. Please try again.',
      });
      dispatch({ type: AIChatActions.FINISH_AI_STREAMING });
    };

    xhr.onabort = () => {
      xhrRef.current = null;
      if (!done) dispatch({ type: AIChatActions.FINISH_AI_STREAMING });
    };

    xhr.open('POST', `${API_URLS.AIChat}/ask/stream`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'text/event-stream');
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.send(JSON.stringify({ question: trimmed }));
  };

  const clearMessages = () => {
    if (xhrRef.current) {
      xhrRef.current.abort();
      xhrRef.current = null;
    }
    dispatch({ type: AIChatActions.CLEAR_MESSAGES });
  };

  const reset = () => {
    if (xhrRef.current) {
      xhrRef.current.abort();
      xhrRef.current = null;
    }
    dispatch({ type: AIChatActions.RESET });
  };

  const stop = () => {
    if (xhrRef.current) {
      xhrRef.current.abort();
      xhrRef.current = null;
    }
    dispatch({ type: AIChatActions.FINISH_AI_STREAMING });
  };

  return {
    ...state,
    ask,
    stop,
    clearMessages,
    reset,
  };
};

export default AIChatState;
