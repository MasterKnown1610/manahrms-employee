import { initialState } from './state';

const aiChatHandlers = {
  SET_LOADING: (state) => ({
    ...state,
    loading: true,
    error: null,
  }),
  SET_ERROR: (state, action) => ({
    ...state,
    loading: false,
    streaming: false,
    error: action.payload,
  }),
  ADD_MESSAGE: (state, action) => ({
    ...state,
    messages: [...state.messages, action.payload],
  }),
  SET_AI_RESPONSE: (state, action) => ({
    ...state,
    messages: [...state.messages, action.payload],
    loading: false,
    streaming: false,
    error: null,
  }),
  // Adds an empty assistant message placeholder and marks streaming started
  START_AI_STREAMING: (state, action) => ({
    ...state,
    loading: true,
    streaming: true,
    error: null,
    messages: [...state.messages, { id: action.payload, role: 'assistant', text: '' }],
  }),
  // Appends a chunk to the last assistant message; turns off loading once data arrives
  APPEND_AI_TEXT: (state, action) => {
    const msgs = [...state.messages];
    const last = msgs[msgs.length - 1];
    if (last && last.role === 'assistant') {
      msgs[msgs.length - 1] = { ...last, text: last.text + action.payload };
    }
    return { ...state, messages: msgs, loading: false };
  },
  FINISH_AI_STREAMING: (state) => ({
    ...state,
    loading: false,
    streaming: false,
  }),
  CLEAR_MESSAGES: (state) => ({
    ...state,
    messages: [],
    error: null,
    loading: false,
    streaming: false,
  }),
  RESET: () => initialState,
};

const Reducer = (state, action) => {
  const handler = aiChatHandlers[action.type];
  return handler ? handler(state, action) : state;
};

export default Reducer;
