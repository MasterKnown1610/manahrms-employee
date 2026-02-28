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
    error: null,
  }),
  CLEAR_MESSAGES: (state) => ({
    ...state,
    messages: [],
    error: null,
  }),
};

const Reducer = (state, action) => {
  const handler = aiChatHandlers[action.type];
  return handler ? handler(state, action) : state;
};

export default Reducer;
